// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "spothotel-2d678.firebaseapp.com",
  projectId: "spothotel-2d678",
  storageBucket: "spothotel-2d678.appspot.com",
  messagingSenderId: "447245069461",
  appId: "1:447245069461:web:8b88a7833669b89c9f3f9c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);