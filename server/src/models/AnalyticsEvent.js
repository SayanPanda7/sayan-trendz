import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    path: String,
    sessionId: String,
    value: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
