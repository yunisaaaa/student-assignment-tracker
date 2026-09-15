import { initializeApp } from 'firebase/app';
import { getDatabase, ref as dbRef, get, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function checkFirebaseConnection() {
  try {
    const connectedRef = dbRef(db, '.info/connected');
    const snapshot = await get(connectedRef);
    return Boolean(snapshot.val());
  } catch (error) {
    console.error('Firebase connection check failed:', error);
    return false;
  }
}

export function watchFirebaseConnection(callback: (isConnected: boolean) => void) {
  const connectedRef = dbRef(db, '.info/connected');
  return onValue(connectedRef, (snapshot) => {
    callback(Boolean(snapshot.val()));
  });
}

export { app, db };