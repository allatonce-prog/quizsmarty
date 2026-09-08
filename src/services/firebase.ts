import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Default Firebase Client Config (Safe Fallback / Initialization)
const firebaseConfig = {
  apiKey: "AIzaSyDemoQuizSmartyApiKey_QuizMarty2026",
  authDomain: "quizsmarty-ai.firebaseapp.com",
  projectId: "quizsmarty-ai",
  storageBucket: "quizsmarty-ai.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:8a9b0c1d2e3f4g"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const firebaseService = {
  async loginAnonymous() {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.warn('Firebase Anonymous Login fallback to local guest session:', error);
      return {
        uid: 'guest_anon_' + Date.now(),
        isAnonymous: true,
        displayName: 'Guest Student',
        email: null,
      };
    }
  },

  async registerEmail(email: string, pass: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed.');
    }
  },

  async loginEmail(email: string, pass: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      return result.user;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed.');
    }
  },

  async logoutUser() {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
  }
};
