// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjbhVLJ5Klnz3x2dDvVEnfcG7-q9_YHUg",
  authDomain: "pbmify-e08ac.firebaseapp.com",
  projectId: "pbmify-e08ac",
  storageBucket: "pbmify-e08ac.appspot.com",
  messagingSenderId: "727330208696",
  appId: "1:727330208696:web:fb980220b63072b8b4ad4d",
  measurementId: "G-NXC7HR2V2T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
