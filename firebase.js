// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCamODLqBkpdbUXOqTOOb_GFL20qmZ-XJ8",
  authDomain: "recordapp-79b0d.firebaseapp.com",
  projectId: "recordapp-79b0d",
  storageBucket: "recordapp-79b0d.appspot.com",
  messagingSenderId: "926332424653",
  appId: "1:926332424653:web:52cc6c39bb906c90baf484",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
