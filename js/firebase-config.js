import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAfHeI7ANmrTf_jqy5uA-PPr8dnTz7rn6U",
  authDomain: "waste-management-system-9ab59.firebaseapp.com",
  projectId: "waste-management-system-9ab59",
  storageBucket: "waste-management-system-9ab59.firebasestorage.app",
  messagingSenderId: "703538998852",
  appId: "1:703538998852:web:641acb03b00d64cd719611",
  measurementId: "G-KNG4RPZ6WF"
};
    
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
