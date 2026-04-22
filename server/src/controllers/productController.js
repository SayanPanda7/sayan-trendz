import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { slugify } from '../utils/slugify.js';

function normalizeInventory(inventory = {}) {
  const sizes = Array.isArray(inventory.sizes) ? inventory.sizes : [];
  const total = sizes.reduce((sum, size) => sum + Number(size.stock || 0), 0);

  return {
    lowStockThreshold: Number(inventory.lowStockThreshold || 8),
    sizes,
    total: inventory.total !== undefined ? Number(inventory.total) : total,
  };
}

export async function listProducts(req, res) {
  const { search, category, collection, tag, limit = 24, adminView } = req.query;
  const filters = {};

  if (!adminView || req.user?.role !== 'admin') {
    filters.status = 'active';
  }

  if (category) {
    filters.category = category;
  }

  if (collection) {
    filters.collections = collection;
  }

  if (tag) {
    filters.tags = tag;
  }

  if (search) {
    filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const products = await Product.find(filters)
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    products,
  });
}

export async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  product.metrics.views += 1;
  await product.save();

  res.json({
    success: true,
    product,
  });
}

export async function createProduct(req, res) {
  const payload = req.body;
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

  const product = await Product.create({
    ...payload,
    slug,
    sku: payload.sku || `SKU-${Date.now()}`,
    inventory: normalizeInventory(payload.inventory),
  });

  res.status(201).json({
    success: true,
    product,
  });
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  const payload = req.body;

  Object.assign(product, payload);

  if (payload.title || payload.slug) {
    product.slug = slugify(payload.slug || payload.title);
  }

  if (payload.inventory) {
    product.inventory = normalizeInventory(payload.inventory);
  }

  await product.save();

  res.json({
    success: true,
    product,
  });
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  await product.deleteOne();

  res.json({
    success: true,
    deletedId: req.params.id,
  });
}
