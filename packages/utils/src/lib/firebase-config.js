// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'my-firebase-project.firebaseapp.com',
  projectId: 'my-firebase-project',
  storageBucket: 'my-firebase-project.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

// Initialize Firebase App
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// authentication
export const auth = getAuth(app);

// firestore database
export const db = getFirestore(app);

// analytics (browser-only and capability-checked)
export let analytics = null;

export async function initializeAnalytics() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      return null;
    }

    analytics = getAnalytics(app);
    return analytics;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase Analytics initialization skipped:', error);
    }
    return null;
  }
}

if (typeof window !== 'undefined') {
  void initializeAnalytics();
}
