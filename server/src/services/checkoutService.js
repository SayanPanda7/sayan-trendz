import { Coupon } from '../models/Coupon.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';

export async function hydrateOrderItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Your bag is empty.');
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return items.map((item) => {
    const product = productMap.get(String(item.productId));

    if (!product) {
      throw new ApiError(404, 'One of the selected products no longer exists.');
    }

    const quantity = Number(item.quantity || 1);
    const size = item.size || product.inventory?.sizes?.[0]?.label || 'Free Size';
    const matchedSize = product.inventory?.sizes?.find((inventoryItem) => inventoryItem.label === size);
    const availableStock = matchedSize ? matchedSize.stock : product.inventory?.total ?? 0;

    if (availableStock < quantity) {
      throw new ApiError(400, `${product.title} is low in stock for size ${size}.`);
    }

    return {
      product,
      quantity,
      size,
      totalPrice: product.salePrice * quantity,
    };
  });
}

export async function resolveCoupon({ code, subtotal, products, user }) {
  if (!code) {
    return { coupon: null, discount: 0 };
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    throw new ApiError(404, 'Coupon not found or inactive.');
  }

  const now = new Date();

  if ((coupon.startAt && coupon.startAt > now) || (coupon.endAt && coupon.endAt < now)) {
    throw new ApiError(400, 'Coupon is not valid right now.');
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, 'Coupon usage limit has been reached.');
  }

  if (subtotal < coupon.minOrderValue) {
    throw new ApiError(400, `Coupon requires a minimum order of Rs. ${coupon.minOrderValue}.`);
  }

  if (coupon.firstOrderOnly && (user?.analytics?.totalOrders || 0) > 0) {
    throw new ApiError(400, 'Coupon is available for first-time customers only.');
  }

  if (coupon.applicableCategories.length > 0) {
    const matchesCategory = products.some((product) => coupon.applicableCategories.includes(product.category));
    if (!matchesCategory) {
      throw new ApiError(400, 'Coupon is not applicable for the selected collection.');
    }
  }

  if (coupon.applicableTags.length > 0) {
    const matchesTags = products.some((product) => product.tags.some((tag) => coupon.applicableTags.includes(tag)));
    if (!matchesTags) {
      throw new ApiError(400, 'Coupon is not applicable for the selected styles.');
    }
  }

  let discount =
    coupon.type === 'percentage'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  return { coupon, discount };
}

export async function buildOrderPricing({ items, couponCode, user }) {
  const hydratedItems = await hydrateOrderItems(items);
  const subtotal = hydratedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const { coupon, discount } = await resolveCoupon({
    code: couponCode,
    subtotal,
    products: hydratedItems.map((item) => item.product),
    user,
  });

  const shipping = subtotal - discount >= 1499 ? 0 : 99;
  const taxableBase = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxableBase * 0.05);
  const total = Math.max(taxableBase + shipping + tax, 0);

  return {
    hydratedItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    coupon,
  };
}

export async function decrementInventory(order) {
  await Promise.all(
    order.items.map(async (item) => {
      const product = await Product.findById(item.product);

      if (!product) {
        return;
      }

      product.inventory.total = Math.max((product.inventory.total || 0) - item.quantity, 0);
      product.metrics.totalSold = (product.metrics.totalSold || 0) + item.quantity;

      const matchedSize = product.inventory.sizes.find((size) => size.label === item.size);
      if (matchedSize) {
        matchedSize.stock = Math.max(matchedSize.stock - item.quantity, 0);
      }

      await product.save();
    }),
  );
}
