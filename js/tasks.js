import { db, auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadTasks(user) {

    const role =
        localStorage.getItem("role");

    console.log("Current Role:", role);
    console.log("Current User:", user.email);

    const tableBody =
        document.getElementById("tasksTable");

    tableBody.innerHTML = "";

    const querySnapshot =
        await getDocs(collection(db, "wasteRequests"));

    querySnapshot.forEach((requestDoc) => {

        const data =
            requestDoc.data();

        let canViewTask = false;

        // Admin sees ALL assigned tasks
        if (
            role === "admin" &&
            data.status === "Assigned"
        ) {

            canViewTask = true;

        }

        // Collector sees ONLY their own assigned tasks
        if (
            role === "collector" &&
            data.status === "Assigned" &&
            data.collector === user.email
        ) {

            canViewTask = true;

        }

        if (canViewTask) {

            tableBody.innerHTML += `
            <tr>
                <td>${requestDoc.id}</td>
                <td>${data.wasteType}</td>
                <td>${data.quantity}</td>
                <td>${data.location}</td>
                <td>${data.collector || "Not Assigned"}</td>
                <td>${data.status}</td>
                <td>
                    <button
                        class="complete-btn"
                        data-id="${requestDoc.id}">
                        Mark Collected
                    </button>
                </td>
            </tr>
            `;

        }

    });

    addCompleteEvents(user);

}

async function addCompleteEvents(user) {

    const buttons =
        document.querySelectorAll(".complete-btn");

    buttons.forEach(button => {

        button.addEventListener("click", async () => {

            const id =
                button.dataset.id;

            await updateDoc(
                doc(db, "wasteRequests", id),
                {
                    status: "Completed",
                    completedAt: new Date()
                }
            );

            alert("Waste Collected Successfully");

            loadTasks(user);

        });

    });

}

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }

    loadTasks(user);

});

const searchInput =
    document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                .toLowerCase();

            const rows =
                document.querySelectorAll(
                    "#tasksTable tr"
                );

            rows.forEach(row => {

                const text =
                    row.textContent
                    .toLowerCase();

                row.style.display =
                    text.includes(searchTerm)
                    ? ""
                    : "none";

            });

        }
    );

}