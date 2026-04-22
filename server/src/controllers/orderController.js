import crypto from 'crypto';
import { env } from '../config/env.js';
import { razorpayClient } from '../config/razorpay.js';
import { Order } from '../models/Order.js';
import { buildOrderPricing, decrementInventory } from '../services/checkoutService.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService.js';
import { ApiError } from '../utils/apiError.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

function buildOrderItems(hydratedItems) {
  return hydratedItems.map(({ product, quantity, size, totalPrice }) => ({
    product: product._id,
    title: product.title,
    slug: product.slug,
    image: product.images[0],
    sku: product.sku,
    size,
    quantity,
    unitPrice: product.salePrice,
    totalPrice,
  }));
}

export async function createOrder(req, res) {
  const { items, address, couponCode, paymentMethod = 'razorpay', notes } = req.body;
  const pricing = await buildOrderPricing({ items, couponCode, user: req.user });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: buildOrderItems(pricing.hydratedItems),
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    shipping: pricing.shipping,
    tax: pricing.tax,
    total: pricing.total,
    coupon: pricing.coupon
      ? { code: pricing.coupon.code, type: pricing.coupon.type, amount: pricing.discount }
      : undefined,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'cod' : 'pending',
    status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
    address,
    notes,
    timeline: [{ status: 'pending', note: 'Order created' }],
  });

  if (paymentMethod === 'cod') {
    await decrementInventory(order);
    req.user.analytics.totalOrders += 1;
    req.user.analytics.lifetimeValue += order.total;
    await req.user.save();
    await sendOrderConfirmationEmail({ order, user: req.user });

    return res.status(201).json({
      success: true,
      order,
      payment: { mode: 'cod' },
    });
  }

  if (!razorpayClient && env.allowDevAuth) {
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.timeline.push({ status: 'confirmed', note: 'Dev-mode payment completed' });
    await order.save();
    await decrementInventory(order);
    req.user.analytics.totalOrders += 1;
    req.user.analytics.lifetimeValue += order.total;
    await req.user.save();
    await sendOrderConfirmationEmail({ order, user: req.user });

    return res.status(201).json({
      success: true,
      order,
      payment: {
        mode: 'simulation',
        message: 'Razorpay keys are not configured, so a development payment flow was used.',
      },
    });
  }

  if (!razorpayClient) {
    throw new ApiError(500, 'Razorpay is not configured.');
  }

  const razorpayOrder = await razorpayClient.orders.create({
    amount: Math.round(order.total * 100),
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      internalOrderId: String(order._id),
      customerEmail: req.user.email || '',
    },
  });

  order.paymentStatus = 'created';
  order.paymentGateway.razorpayOrderId = razorpayOrder.id;
  order.timeline.push({ status: 'pending', note: 'Razorpay order created' });
  await order.save();

  res.status(201).json({
    success: true,
    order,
    payment: {
      mode: 'razorpay',
      keyId: env.razorpay.keyId,
      razorpayOrder,
    },
  });
}

export async function verifyRazorpayPayment(req, res) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(orderId).populate('user');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  if (!razorpayClient) {
    throw new ApiError(500, 'Razorpay is not configured.');
  }

  const generatedSignature = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    order.paymentStatus = 'failed';
    await order.save();
    throw new ApiError(400, 'Payment signature verification failed.');
  }

  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.paymentGateway = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  };
  order.timeline.push({ status: 'confirmed', note: 'Payment captured successfully' });
  await order.save();

  await decrementInventory(order);

  order.user.analytics.totalOrders += 1;
  order.user.analytics.lifetimeValue += order.total;
  await order.user.save();

  await sendOrderConfirmationEmail({ order, user: order.user });

  res.json({
    success: true,
    order,
  });
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    orders,
  });
}

export async function listOrders(req, res) {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    orders,
  });
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('user');

  if (!order) {
    throw new ApiError(404, 'Order not found.');
  }

  order.status = status;
  order.timeline.push({ status, note: `Order updated to ${status}` });
  await order.save();
  await sendOrderStatusEmail({ order, user: order.user });

  res.json({
    success: true,
    order,
  });
}
