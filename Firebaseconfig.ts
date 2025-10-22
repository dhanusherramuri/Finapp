
// // // Import the functions you need from the SDKs you need
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeApp } from 'firebase/app';
// import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAAcBL5FhY1VLKPYufy7ugKEoDaqHwbipM",
//     authDomain: "fintech-2210.firebaseapp.com",
//     projectId: "fintech-2210",
//     storageBucket: "fintech-2210.firebasestorage.app",
//     messagingSenderId: "297107126321",
//     appId: "1:297107126321:web:7da7201349027229b37d10"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const Auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });
// export const db = getFirestore(app);


import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Auth = initializeAuth(app, {
    persistence: AsyncStorage
  });
} catch (error) {
  // If already initialized, get the existing instance
  Auth = getAuth(app);
}

export { Auth };
