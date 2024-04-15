import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { createUserWithEmailAndPassword } from "firebase/auth";
import firebase from 'firebase/compat/app';


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

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {app, auth, provider, createUserWithEmailAndPassword};
