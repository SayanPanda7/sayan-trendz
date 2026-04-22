import { buildAdminDashboard, recordAnalyticsEvent } from '../services/analyticsService.js';

export async function trackEvent(req, res) {
  await recordAnalyticsEvent({
    ...req.body,
    user: req.user?._id,
  });

  res.status(201).json({
    success: true,
  });
}

export async function getDashboard(req, res) {
  const dashboard = await buildAdminDashboard();

  res.json({
    success: true,
    dashboard,
  });
}
