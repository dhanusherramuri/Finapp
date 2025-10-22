


import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAcBL5FhY1VLKPYufy7ugKEoDaqHwbipM",
    authDomain: "fintech-2210.firebaseapp.com",
    projectId: "fintech-2210",
    storageBucket: "fintech-2210.firebasestorage.app",
    messagingSenderId: "297107126321",
    appId: "1:297107126321:web:7da7201349027229b37d10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage
let Auth;
try {
  Auth = initializeAuth(app);
} catch (error) {
  // If already initialized, get the existing instance
  Auth = getAuth(app);
}

export { Auth };

