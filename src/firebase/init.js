import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyADs_TLAbGhDdcNGXOSAdhA7y-iC_j3mKc",
  authDomain: "angelhaven-fd890.firebaseapp.com",
  projectId: "angelhaven-fd890",
  storageBucket: "angelhaven-fd890.appspot.com",
  messagingSenderId: "734932676720",
  appId: "1:734932676720:web:1e8697b20d81a55cd104b5",
  measurementId: "G-FH4JKHGBW6"
};
const firbaseApp = initializeApp(firebaseConfig);

const db = getFirestore()
export default db


