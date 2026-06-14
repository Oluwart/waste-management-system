import { db, auth } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadCompleted() {

    const role =
    localStorage.getItem("role");

    const tableBody =
        document.getElementById("completedTable");

    tableBody.innerHTML = "";

    let totalCollections = 0;
    let plasticCollected = 0;
    let organicCollected = 0;

    const querySnapshot =
        await getDocs(collection(db, "wasteRequests"));

    querySnapshot.forEach((requestDoc) => {

        const data = requestDoc.data();

       if (
            data.status === "Completed" &&
            (
                role === "admin" ||
                data.collector === auth.currentUser.email
            )
        ) {

            totalCollections++;

            if (
                data.wasteType &&
                data.wasteType.toLowerCase() === "plastic"
            ) {
                plasticCollected++;
            }

            if (
                data.wasteType &&
                data.wasteType.toLowerCase() === "organic"
            ) {
                organicCollected++;
            }

            let completedDate = "N/A";

            if (data.completedAt) {

                completedDate =
                    data.completedAt
                        .toDate()
                        .toLocaleDateString();

            }

            tableBody.innerHTML += `
            <tr>
                <td>${requestDoc.id}</td>
                <td>${data.wasteType}</td>
                <td>${data.quantity}</td>
                <td>${data.location}</td>
                <td>${data.collector}</td>
                <td>${completedDate}</td>
                <td>
                    <span class="status completed">
                        Completed
                    </span>
                </td>
            </tr>
            `;
        }

    });

    const totalCollectionsEl =
        document.getElementById("totalCollections");

    const plasticCollectedEl =
        document.getElementById("plasticCollected");

    const organicCollectedEl =
        document.getElementById("organicCollected");

    if (totalCollectionsEl) {
        totalCollectionsEl.textContent =
            totalCollections;
    }

    if (plasticCollectedEl) {
        plasticCollectedEl.textContent =
            plasticCollected;
    }

    if (organicCollectedEl) {
        organicCollectedEl.textContent =
            organicCollected;
    }

}

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
                    "#completedTable tr"
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

loadCompleted();