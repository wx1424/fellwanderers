// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbfuHvkr7s8u88FTfz9kFMlMQ6cDIB7wQ",
  authDomain: "icfellwanderers.firebaseapp.com",
  projectId: "icfellwanderers",
  storageBucket: "icfellwanderers.firebasestorage.app",
  messagingSenderId: "954474029334",
  appId: "1:954474029334:web:0e740663eecbeb70af7037"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;