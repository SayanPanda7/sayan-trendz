import Razorpay from 'razorpay';
import { env } from './env.js';

export const razorpayClient =
  env.razorpay.keyId && env.razorpay.keySecret
    ? new Razorpay({
        key_id: env.razorpay.keyId,
        key_secret: env.razorpay.keySecret,
      })
    : null;
