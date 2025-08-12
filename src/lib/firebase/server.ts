
import { getApp, getApps, initializeApp } from 'firebase/app';
import admin from 'firebase-admin';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage } from 'firebase-admin/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

function getServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!serviceAccountJson || serviceAccountJson === 'placeholder') {
    // Return null if the service account is not configured
    return null;
  }
  try {
    return JSON.parse(Buffer.from(serviceAccountJson, 'base64').toString('utf-8'));
  } catch (error) {
    console.error("Error parsing Firebase service account JSON:", error);
    return null;
  }
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function initializeAdminApp() {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    // If no service account, don't initialize admin app
    return null;
  }

  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch(error) {
    console.error("Firebase admin initialization error", error);
    return null;
  }
}

function getClientApp() {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

export const adminDb = () => {
  if (!initializeAdminApp()) return null;
  return getAdminFirestore();
};

export const adminAuth = () => {
  if (!initializeAdminApp()) return null;
  return getAdminAuth();
};

export const adminStorage = () => {
  // adminStorage needs the client app, which doesn't need admin credentials
  // but file manipulation in actions.ts does use it in combination with adminDb.
  // The logic inside actions should handle the possibility of adminDb being null.
  return getStorage(getClientApp());
};
