// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.x.x/firebase-auth.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-auth-domain",
    projectId: "tu-project-id",
    storageBucket: "tu-storage-bucket",
    messagingSenderId: "tu-messaging-sender-id",
    appId: "tu-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };