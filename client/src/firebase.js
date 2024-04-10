// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d50a0.firebaseapp.com",
  projectId: "mern-blog-d50a0",
  storageBucket: "mern-blog-d50a0.appspot.com",
  messagingSenderId: "988372437082",
  appId: "1:988372437082:web:857e9ceab808e6294e7063",
  measurementId: "G-9F8E8WCLWR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);