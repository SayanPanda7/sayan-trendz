const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function normalizeProduct(rawProduct) {
  const images = rawProduct.images?.length
    ? rawProduct.images
    : [rawProduct.primaryImage, rawProduct.secondaryImage].filter(Boolean);
  const sizes = rawProduct.sizes?.length
    ? rawProduct.sizes
    : rawProduct.inventory?.sizes?.map((size) => size.label) || ['S', 'M', 'L', 'XL'];
  const salePrice = Number(rawProduct.salePrice || rawProduct.price || 0);
  const mrp = Number(rawProduct.mrp || rawProduct.compareAtPrice || salePrice);
  const reviews = Number(rawProduct.reviews || rawProduct.reviewsCount || 0);

  return {
    ...rawProduct,
    id: rawProduct.id || rawProduct._id || rawProduct.slug,
    _id: rawProduct._id || rawProduct.id || rawProduct.slug,
    slug: rawProduct.slug || slugify(rawProduct.title),
    images,
    primaryImage: rawProduct.primaryImage || images[0],
    secondaryImage: rawProduct.secondaryImage || images[1] || images[0],
    sizes,
    salePrice,
    mrp,
    rating: Number(rawProduct.rating || 4.7),
    reviews,
    reviewsCount: reviews,
    badge: rawProduct.badge || 'Curated Pick',
    tags: rawProduct.tags || [],
    collections: rawProduct.collections || [],
    colorways: rawProduct.colorways || ['Ivory', 'Mocha', 'Rosewood'],
    inventory: rawProduct.inventory || {
      total: sizes.length * 6,
      lowStockThreshold: 8,
      sizes: sizes.map((size) => ({ label: size, stock: 6 })),
    },
    emi:
      rawProduct.emi ||
      `EMI from ₹${Math.max(99, Math.round(Math.max(salePrice, 1) / 6))}/month`,
    stockLabel:
      rawProduct.stockLabel ||
      (rawProduct.inventory?.total <= 8 ? 'Only a few pieces left' : 'Ready to ship within 24 hours'),
    description:
      rawProduct.description ||
      'A premium jewelry piece designed with polished detailing, elegant shine, and boutique-inspired finishing.',
    details:
      rawProduct.details || rawProduct.features || ['Premium boutique finish', 'Refined jewelry detailing', 'Elegant styling from daily wear to festive occasions'],
    washCare:
      rawProduct.washCare || ['Gentle hand wash', 'Steam inside out', 'Do not bleach'],
    shipping:
      rawProduct.shipping || ['Free shipping on prepaid orders', 'Easy 7-day exchange'],
    offers:
      rawProduct.offers || ['Flat 10% off on first order', 'Extra 5% on prepaid checkout'],
    category: rawProduct.category || 'Fashion',
    fabric: rawProduct.fabric || 'Premium Blend',
  };
}
