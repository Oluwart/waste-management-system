import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const usersSnapshot =
            await getDocs(collection(db, "users"));

        let role = "";

        usersSnapshot.forEach(doc => {

            const user = doc.data();

            if(user.email === email) {

                role = user.role;

            }

        });

        if(role === "admin") {
            
            localStorage.setItem("role", role);

            window.location.href =
                "dashboard.html";

        }
        else if(role === "collector") {

            localStorage.setItem("role", role);

            window.location.href =
                "collector-requests.html";

        }
        else {

            alert("User role not found");

        }

    }
    catch(error) {

        alert(error.message);

    }

});