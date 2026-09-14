import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB2weLvAGiwzu6MkSqwygozmU0LELpieiY",
  authDomain: "expense-tracker-12785.firebaseapp.com",
  projectId: "expense-tracker-12785",
  storageBucket: "expense-tracker-12785.firebasestorage.app",
  messagingSenderId: "1046235248272",
  appId: "1:1046235248272:web:cfb172877de26cbf334a15",
  measurementId: "G-6YKNZR05H1"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
