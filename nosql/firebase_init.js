// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXp418Lr15t0boYkt3s4fmjCaCcb33ERM",
  authDomain: "dbfinalproyect.firebaseapp.com",
  projectId: "dbfinalproyect",
  storageBucket: "dbfinalproyect.firebasestorage.app",
  messagingSenderId: "580827103927",
  appId: "1:580827103927:web:fa9bf7ba2b9bf8f23dc332"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export { db };