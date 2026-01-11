import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCUt6MbCZwcfP4AdZM1aw1fBRZwDzmosGE",
  authDomain: "goals-d50ab.firebaseapp.com",
  projectId: "goals-d50ab",
  storageBucket: "goals-d50ab.appspot.com",
  messagingSenderId: "512069824767",
  appId: "1:512069824767:web:4fd135b98c5e8c89789cca",
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account', scope: 'email profile' });

export { app, auth, firestore, firestore as db, googleProvider };
