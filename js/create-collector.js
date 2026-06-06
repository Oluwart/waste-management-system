import { db, auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form =
    document.getElementById("collectorForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        // Create Authentication Account

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Save User Record

        await addDoc(
            collection(db, "users"),
            {
                name,
                email,
                role: "collector"
            }
        );

        alert("Collector Created Successfully");

        form.reset();

    }
    catch(error) {

        console.error(error);

        alert(error.message);

    }

});