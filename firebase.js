// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9wlkdW1u6UPKwu05bjw0vZ4NIbIOJ1YI",
  authDomain: "jash-savla-pantry-tracker-app.firebaseapp.com",
  projectId: "jash-savla-pantry-tracker-app",
  storageBucket: "jash-savla-pantry-tracker-app.appspot.com",
  messagingSenderId: "261881074641",
  appId: "1:261881074641:web:7d34f8ced17128198ac6f0",
  measurementId: "G-VLF8HRPGFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}