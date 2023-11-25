
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import router from './router'; // Import your router file
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap';

const firebaseConfig = {
    apiKey: "AIzaSyADs_TLAbGhDdcNGXOSAdhA7y-iC_j3mKc",
    authDomain: "angelhaven-fd890.firebaseapp.com",
    projectId: "angelhaven-fd890",
    storageBucket: "angelhaven-fd890.appspot.com",
    messagingSenderId: "734932676720",
    appId: "1:734932676720:web:1e8697b20d81a55cd104b5",
    measurementId: "G-FH4JKHGBW6"
  };


const firebaseApp = initializeApp(firebaseConfig);
const app = createApp(App);

app.use(router); // Make sure to use the router

app.mount('#app');
