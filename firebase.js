// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvsfkPJ9amAardyiUTaCCMcWqY3EMYEhQ",
  authDomain: "flashcardsaas-5df1b.firebaseapp.com",
  projectId: "flashcardsaas-5df1b",
  storageBucket: "flashcardsaas-5df1b.appspot.com",
  messagingSenderId: "979645564909",
  appId: "1:979645564909:web:9f258ab905eb144d7ac9e4",
  measurementId: "G-ZCR8M10X64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };