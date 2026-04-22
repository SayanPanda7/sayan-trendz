import mongoose from 'mongoose';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export async function recordAnalyticsEvent(payload) {
  return AnalyticsEvent.create(payload);
}

export async function buildAdminDashboard() {
  const [revenueAggregate, orderCount, productCount, activeCoupons, lowStockProducts, recentOrders, topProducts, recentEvents] =
    await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: { $in: ['paid', 'cod'] } } },
        { $group: { _id: null, revenue: { $sum: '$total' }, avgOrderValue: { $avg: '$total' } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      Coupon.countDocuments({ isActive: true }),
      Product.find({ 'inventory.total': { $lte: 8 }, status: 'active' })
        .select('title slug inventory.total inventory.lowStockThreshold salePrice images')
        .sort({ 'inventory.total': 1 })
        .limit(6),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(8),
      Product.find()
        .sort({ 'metrics.totalSold': -1, rating: -1 })
        .limit(6),
      AnalyticsEvent.find().sort({ createdAt: -1 }).limit(8),
    ]);

  const salesByDay = await Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'cod'] }, createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        total: { $sum: '$total' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const revenue = revenueAggregate[0]?.revenue || 0;
  const avgOrderValue = Math.round(revenueAggregate[0]?.avgOrderValue || 0);

  return {
    stats: {
      revenue,
      orderCount,
      productCount,
      activeCoupons,
      avgOrderValue,
    },
    lowStockProducts,
    recentOrders,
    topProducts,
    salesByDay,
    recentEvents,
  };
}

export function toObjectId(value) {
  return new mongoose.Types.ObjectId(value);
}
