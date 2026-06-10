import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadCollectors() {

    const tableBody =
        document.getElementById("collectorsTable");

    tableBody.innerHTML = "";

    const usersSnapshot =
        await getDocs(
            collection(db, "users")
        );

    const requestsSnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    const completedCounts = {};

    requestsSnapshot.forEach((requestDoc) => {

        const data = requestDoc.data();

        if (
            data.status === "Completed" &&
            data.collector
        ) {

            completedCounts[data.collector] =
                (completedCounts[data.collector] || 0) + 1;

        }

    });

    usersSnapshot.forEach((userDoc) => {

        const user = userDoc.data();

        if (user.role === "collector") {

            const completedJobs =
                completedCounts[user.email] || 0;

            tableBody.innerHTML += `
            <tr>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>Waste Collector</td>

                <td>${completedJobs}</td>

                <td>

                    <button
                        class="view-btn"
                        data-id="${userDoc.id}">
                        View
                    </button>

                    <button
                        class="edit-btn"
                        data-id="${userDoc.id}"
                        data-name="${user.name}">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${userDoc.id}">
                        Delete
                    </button>

                </td>

            </tr>
            `;
        }

    });

    addViewEvents();
    addEditEvents();
    addDeleteEvents();

}

async function addEditEvents() {

    const buttons =
        document.querySelectorAll(".edit-btn");

    buttons.forEach((button) => {

        button.addEventListener("click", async () => {

            const id =
                button.dataset.id;

            const currentName =
                button.dataset.name;

            const newName =
                prompt(
                    "Enter new collector name:",
                    currentName
                );

            if (!newName) return;

            await updateDoc(
                doc(db, "users", id),
                {
                    name: newName
                }
            );

            alert("Collector updated");

            loadCollectors();

        });

    });

}

async function addDeleteEvents() {

    const buttons =
        document.querySelectorAll(".delete-btn");

    buttons.forEach((button) => {

        button.addEventListener("click", async () => {

            const id =
                button.dataset.id;

            const confirmDelete =
                confirm(
                    "Delete this collector?"
                );

            if (!confirmDelete) return;

            await deleteDoc(
                doc(db, "users", id)
            );

            alert("Collector deleted");

            loadCollectors();

        });

    });

}

    function addViewEvents() {

        const buttons =
            document.querySelectorAll(".view-btn");

        buttons.forEach((button) => {

            button.addEventListener("click", () => {

                const id =
                    button.dataset.id;

                window.location.href =
                    `collector-profile.html?id=${id}`;

            });

        });

    }

loadCollectors();


// Search Feature

const searchInput =
    document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const term =
        searchInput.value.toLowerCase();

    const rows =
        document.querySelectorAll(
            "#collectorsTable tr"
        );

    rows.forEach((row) => {

        const text =
            row.textContent.toLowerCase();

        row.style.display =
            text.includes(term)
            ? ""
            : "none";

    });

});