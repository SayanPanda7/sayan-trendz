import { Coupon } from '../models/Coupon.js';
import { buildOrderPricing } from '../services/checkoutService.js';
import { Product } from '../models/Product.js';

export async function validateCoupon(req, res) {
  const { code, items } = req.body;
  const pricing = await buildOrderPricing({
    items,
    couponCode: code,
    user: req.user,
  });

  res.json({
    success: true,
    coupon: pricing.coupon,
    discount: pricing.discount,
    totals: {
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      tax: pricing.tax,
      total: pricing.total,
    },
  });
}

export async function listCoupons(req, res) {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    coupons,
  });
}

export async function createCoupon(req, res) {
  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase(),
  });

  res.status(201).json({
    success: true,
    coupon,
  });
}

export async function updateCoupon(req, res) {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(req.body.code ? { code: req.body.code.toUpperCase() } : {}),
    },
    { new: true },
  );

  res.json({
    success: true,
    coupon,
  });
}
