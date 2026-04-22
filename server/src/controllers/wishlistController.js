import { Product } from '../models/Product.js';
import { Wishlist } from '../models/Wishlist.js';
import { ApiError } from '../utils/apiError.js';

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, productIds: [] });
  }

  return wishlist;
}

export async function getWishlist(req, res) {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate('productIds');

  res.json({
    success: true,
    wishlist: wishlist.productIds,
  });
}

export async function toggleWishlist(req, res) {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.productIds.some((id) => String(id) === String(productId));

  wishlist.productIds = exists
    ? wishlist.productIds.filter((id) => String(id) !== String(productId))
    : [...wishlist.productIds, productId];

  product.metrics.wishlisted = Math.max(
    0,
    exists ? (product.metrics.wishlisted || 1) - 1 : (product.metrics.wishlisted || 0) + 1,
  );

  await Promise.all([wishlist.save(), product.save()]);
  await wishlist.populate('productIds');

  res.json({
    success: true,
    wishlist: wishlist.productIds,
  });
}
