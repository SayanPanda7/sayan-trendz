import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: ['percentage', 'fixed'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    firstOrderOnly: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    applicableCategories: { type: [String], default: [] },
    applicableTags: { type: [String], default: [] },
    startAt: Date,
    endAt: Date,
  },
  { timestamps: true },
);

export const Coupon = mongoose.model('Coupon', couponSchema);
