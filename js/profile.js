import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    const usersSnapshot =
        await getDocs(collection(db, "users"));

    usersSnapshot.forEach((doc) => {

        const data = doc.data();

        if (data.email === user.email) {

            document.getElementById("userName")
                .textContent =
                data.name || user.email;

            document.getElementById("userRole")
                .textContent =
                data.role === "admin"
                    ? "Administrator"
                    : "Waste Collector" || "User";

            document.getElementById("userAvatar")
                .textContent =
                (data.name || user.email)
                .charAt(0)
                .toUpperCase();

        }

    });

});