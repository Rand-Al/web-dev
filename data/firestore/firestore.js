// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMv_b0fu6XW1zuJQjUIgDaGsQrPP4iGGk",
  authDomain: "web-dev-courses-30679.firebaseapp.com",
  projectId: "web-dev-courses-30679",
  storageBucket: "web-dev-courses-30679.appspot.com",
  messagingSenderId: "583831035209",
  appId: "1:583831035209:web:778e426d30dbf119988e98",
};

const app = initializeApp(firebaseConfig);

const dbFirestore = getFirestore(app);

export default dbFirestore;
