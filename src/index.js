import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/auth"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
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

firebase.initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(alert))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
