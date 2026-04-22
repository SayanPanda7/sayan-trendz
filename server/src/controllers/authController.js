import { User } from '../models/User.js';

export async function syncUser(req, res) {
  const { name, phone, avatar, preferences } = req.body;

  if (name) {
    req.user.name = name;
  }

  if (phone) {
    req.user.phone = phone;
  }

  if (avatar) {
    req.user.avatar = avatar;
  }

  if (preferences) {
    req.user.preferences = {
      ...req.user.preferences.toObject?.(),
      ...preferences,
    };
  }

  await req.user.save();

  res.json({
    success: true,
    user: req.user,
  });
}

export async function getCurrentUser(req, res) {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
}

export async function updateCurrentUser(req, res) {
  const { name, phone, preferences, addresses } = req.body;

  if (name !== undefined) {
    req.user.name = name;
  }

  if (phone !== undefined) {
    req.user.phone = phone;
  }

  if (preferences) {
    req.user.preferences = {
      ...req.user.preferences.toObject?.(),
      ...preferences,
    };
  }

  if (addresses) {
    req.user.addresses = addresses;
  }

  await req.user.save();

  res.json({
    success: true,
    user: req.user,
  });
}
