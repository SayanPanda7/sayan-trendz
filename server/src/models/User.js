import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    fullName: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

const preferenceSchema = new mongoose.Schema(
  {
    darkMode: { type: Boolean, default: false },
    categories: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, index: true, sparse: true },
    email: { type: String, index: true, sparse: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
    addresses: { type: [addressSchema], default: [] },
    preferences: { type: preferenceSchema, default: () => ({}) },
    analytics: {
      lifetimeValue: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
