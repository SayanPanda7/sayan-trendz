import { env } from '../config/env.js';
import { verifyFirebaseToken } from '../config/firebaseAdmin.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

async function resolveUserFromPayload(payload) {
  const email = payload.email?.toLowerCase();
  const role = payload.role || (email && env.adminEmails.includes(email) ? 'admin' : 'user');

  let user =
    (payload.uid && (await User.findOne({ firebaseUid: payload.uid }))) ||
    (email && (await User.findOne({ email })));

  if (!user) {
    user = await User.create({
      firebaseUid: payload.uid,
      email,
      name: payload.name,
      phone: payload.phone_number || payload.phone,
      avatar: payload.picture || payload.avatar,
      role,
      emailVerified: Boolean(payload.email_verified),
      lastLoginAt: new Date(),
    });
  } else {
    user.firebaseUid = user.firebaseUid || payload.uid;
    user.email = user.email || email;
    user.name = payload.name || user.name;
    user.phone = payload.phone_number || payload.phone || user.phone;
    user.avatar = payload.picture || payload.avatar || user.avatar;
    user.emailVerified = payload.email_verified ?? user.emailVerified;
    user.role = env.adminEmails.includes((user.email || '').toLowerCase()) ? 'admin' : user.role;
    user.lastLoginAt = new Date();
    await user.save();
  }

  return user;
}

async function buildIdentity(req) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await verifyFirebaseToken(token);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      phone_number: decodedToken.phone_number,
      email_verified: decodedToken.email_verified,
    };
  }

  if (env.allowDevAuth) {
    return {
      uid: req.headers['x-dev-user-id'] || 'local-dev-user',
      email: req.headers['x-dev-user-email'] || 'demo@sayantrendz.com',
      name: req.headers['x-dev-user-name'] || 'Sayan Trendz Demo',
      role: req.headers['x-dev-user-role'] || 'admin',
      picture: '',
      email_verified: true,
    };
  }

  return null;
}

export async function authenticate(req, res, next) {
  const payload = await buildIdentity(req);

  if (!payload) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  req.user = await resolveUserFromPayload(payload);
  next();
}

export async function optionalAuth(req, res, next) {
  try {
    const payload = await buildIdentity(req);
    req.user = payload ? await resolveUserFromPayload(payload) : null;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required.'));
  }

  next();
}
