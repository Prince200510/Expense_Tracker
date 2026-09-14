// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2weLvAGiwzu6MkSqwygozmU0LELpieiY",
  authDomain: "expense-tracker-12785.firebaseapp.com",
  projectId: "expense-tracker-12785",
  storageBucket: "expense-tracker-12785.firebasestorage.app",
  messagingSenderId: "1046235248272",
  appId: "1:1046235248272:web:cfb172877de26cbf334a15",
  measurementId: "G-6YKNZR05H1"
};

import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);