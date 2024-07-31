// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDukjTH6y_5IGhOpBRzLfUtDDM4H2aczcA",
  authDomain: "inventorymanagement7339.firebaseapp.com",
  projectId: "inventorymanagement7339",
  storageBucket: "inventorymanagement7339.appspot.com",
  messagingSenderId: "564473802365",
  appId: "1:564473802365:web:0a68a9d1cc0b34236b4b14",
  measurementId: "G-WNW6SMCPB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}