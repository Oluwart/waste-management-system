import { db, auth } from "./firebase-config.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadRequests() {

    const role =
        localStorage.getItem("role");

    const tableBody =
        document.getElementById("requestsTable");

    tableBody.innerHTML = "";

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "wasteRequests")
            );

        querySnapshot.forEach((requestDoc) => {

            const data =
                requestDoc.data();

            let actionButtons = "";

            // Collector Actions
            if (role === "collector") {

                if (data.status === "Pending") {

                    actionButtons += `
                        <button
                            class="accept-btn"
                            data-id="${requestDoc.id}">
                            Accept Task
                        </button>
                    `;

                }
                else if (
                    data.collector ===
                    auth.currentUser?.email
                ) {

                    actionButtons += `
                        <button
                            class="accepted-btn"
                            disabled>
                            ✓ Accepted
                        </button>
                    `;

                }

            }

            // Admin Delete Button
            if (role === "admin") {

                actionButtons += `
                    <button
                        class="delete-btn"
                        data-id="${requestDoc.id}">
                        Delete
                    </button>
                `;

            }

            // View Button For Everyone
            actionButtons += `
                <a
                    href="request-details.html?id=${requestDoc.id}"
                    class="view-btn">
                    View
                </a>
            `;

            tableBody.innerHTML += `
            <tr>

                <td>${requestDoc.id}</td>

                <td>${data.wasteType || "-"}</td>

                <td>${data.quantity || "-"}</td>

                <td>${data.location || "-"}</td>

                <td>${data.status || "-"}</td>

                <td>
                    <div class="action-buttons">
                        ${actionButtons}
                    </div>
                </td>

            </tr>
            `;

        });

        addAcceptEvents();
        addDeleteEvents();

    }
    catch(error) {

        console.error(error);

    }

}

function addAcceptEvents() {

    const buttons =
        document.querySelectorAll(
            ".accept-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const id =
                    button.dataset.id;

                try {

                    await updateDoc(
                        doc(
                            db,
                            "wasteRequests",
                            id
                        ),
                        {
                            status: "Assigned",
                            collector:
                                auth.currentUser?.email
                        }
                    );

                    alert(
                        "Task Accepted Successfully"
                    );

                    loadRequests();

                }
                catch(error) {

                    console.error(error);

                    alert(
                        "Failed to accept task"
                    );

                }

            }
        );

    });

}

function addDeleteEvents() {

    const buttons =
        document.querySelectorAll(
            ".delete-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const confirmed =
                    confirm(
                        "Are you sure you want to delete this request?"
                    );

                if (!confirmed) return;

                const id =
                    button.dataset.id;

                try {

                    await deleteDoc(
                        doc(
                            db,
                            "wasteRequests",
                            id
                        )
                    );

                    alert(
                        "Request Deleted Successfully"
                    );

                    loadRequests();

                }
                catch(error) {

                    console.error(error);

                    alert(
                        "Failed To Delete Request"
                    );

                }

            }
        );

    });

}

// Search Feature

const searchInput =
    document.getElementById(
        "searchInput"
    );

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const searchTerm =
                searchInput.value
                .toLowerCase();

            const rows =
                document.querySelectorAll(
                    "#requestsTable tr"
                );

            rows.forEach(row => {

                const text =
                    row.textContent
                    .toLowerCase();

                row.style.display =
                    text.includes(
                        searchTerm
                    )
                    ? ""
                    : "none";

            });

        }
    );

}

loadRequests();