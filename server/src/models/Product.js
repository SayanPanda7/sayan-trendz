import mongoose from 'mongoose';

const inventorySizeSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const seoSchema = new mongoose.Schema(
  {
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,
    keywords: { type: [String], default: [] },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    sku: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    fabric: { type: String, trim: true },
    mrp: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.7 },
    reviewsCount: { type: Number, default: 0 },
    badge: { type: String, trim: true },
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    collections: { type: [String], default: [] },
    colorways: { type: [String], default: [] },
    features: { type: [String], default: [] },
    washCare: { type: [String], default: [] },
    shipping: { type: [String], default: [] },
    offers: { type: [String], default: [] },
    seo: { type: seoSchema, default: () => ({}) },
    inventory: {
      total: { type: Number, default: 0, min: 0 },
      lowStockThreshold: { type: Number, default: 8, min: 0 },
      sizes: { type: [inventorySizeSchema], default: [] },
    },
    metrics: {
      totalSold: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
      wishlisted: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Product', productSchema);
