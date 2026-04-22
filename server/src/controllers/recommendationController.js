import { Product } from '../models/Product.js';
import { scoreRecommendations } from '../services/recommendationService.js';

export async function getRecommendations(req, res) {
  const { productId } = req.query;
  const catalog = await Product.find({ status: 'active' }).limit(60);
  const targetProduct = productId ? catalog.find((item) => String(item._id) === String(productId)) : null;
  const recommendations = scoreRecommendations({
    catalog,
    product: targetProduct,
    user: req.user,
  });

  res.json({
    success: true,
    recommendations,
  });
}
