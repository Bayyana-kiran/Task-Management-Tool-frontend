import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLB9-XvYGG-UNlCUY1pr1awAAKZt-vIfE",
  authDomain: "task-manager-d0bd5.firebaseapp.com",
  databaseURL: "https://task-manager-d0bd5-default-rtdb.firebaseio.com",
  projectId: "task-manager-d0bd5",
  storageBucket: "task-manager-d0bd5.appspot.com",
  messagingSenderId: "721123563194",
  appId: "1:721123563194:web:dbf3e6c205b33f4a87d483",
  measurementId: "G-KSRQSWW5Y4",
};

// Initialize Firebase app
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db };