import admin from 'firebase-admin';
import { env } from './env.js';

let firebaseAdminApp = null;

const canInitialize =
  env.firebase.projectId &&
  env.firebase.clientEmail &&
  env.firebase.privateKey;

if (canInitialize && !admin.apps.length) {
  firebaseAdminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebase.projectId,
      clientEmail: env.firebase.clientEmail,
      privateKey: env.firebase.privateKey,
    }),
  });
}

export const firebaseAdmin = firebaseAdminApp;

export async function verifyFirebaseToken(token) {
  if (!firebaseAdminApp) {
    throw new Error('Firebase Admin SDK is not configured.');
  }

  return admin.auth().verifyIdToken(token);
}
