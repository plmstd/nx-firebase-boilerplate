import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// firebase admin
export const getAdmin = () => {
  // Check if the app already exists
  if (admin.apps.length > 0) {
    const existingApp = admin.apps[0];
    if (existingApp) {
      return existingApp; // Return the existing app instance
    }
  }

  // Initialize a new instance if it doesn't exist
  const cert = JSON.parse(process.env.FB_ADMIN_SERVICE);
  const app = admin.initializeApp({
    credential: admin.credential.cert(cert),
    storageBucket: 'TODO: Add storage bucket',
  });

  // return the app instance
  return app;
};

// firebase auth
/** @returns {import('firebase-admin/auth').Auth} */
export const getAuth = () => getAdmin().auth();

// firebase firestore
/** @returns {import('firebase-admin/firestore').Firestore} */
export const getDatabase = (databaseId = 'db-v2') => {
  const app = getAdmin();
  const db = getFirestore(app, databaseId);
  return db;
};

// firebase storage
/** @returns {import('firebase-admin/storage').Storage} */
export const getStorage = () => {
  const app = getAdmin();
  const storage = app.storage();
  return storage;
};

// firebase bucket
/** @returns {import('@google-cloud/storage').Bucket} */
export const getBucket = () => {
  const storage = getStorage();
  const bucket = storage.bucket();
  return bucket;
};
