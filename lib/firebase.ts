import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBM_iVkcvzEkG5W9_0kZapljP_Cgat5KHI",
  authDomain: "ziggyportfolio-fa3b9.firebaseapp.com",
  projectId: "ziggyportfolio-fa3b9",
  storageBucket: "ziggyportfolio-fa3b9.firebasestorage.app",
  messagingSenderId: "577256577388",
  appId: "1:577256577388:web:c0a0d69bab888295763b49"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { firebaseConfig };
