import { db, auth } from "./firebase-config.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadRequests() {

    const tableBody =
        document.getElementById("requestsTable");

    tableBody.innerHTML = "";

    const querySnapshot =
        await getDocs(collection(db, "wasteRequests"));

    querySnapshot.forEach((requestDoc) => {

        const data = requestDoc.data();

        tableBody.innerHTML += `
        <tr>
            <td>${requestDoc.id}</td>
            <td>${data.wasteType}</td>
            <td>${data.quantity}</td>
            <td>${data.location}</td>
            <td>${data.status}</td>

            <td>

                ${
                    data.status === "Pending"
                    ?
                    `<button
                        class="accept-btn"
                        data-id="${requestDoc.id}">
                        Accept Task
                    </button>`
                    :
                    "Assigned"
                }

            </td>
        </tr>
        `;
    });

    addAcceptEvents();
}

async function addAcceptEvents() {

    const buttons =
        document.querySelectorAll(".accept-btn");

    buttons.forEach(button => {

        button.addEventListener("click", async () => {

            const id =
                button.dataset.id;

            await updateDoc(
                    doc(db, "wasteRequests", id),
                    {
                        status: "Assigned",
                        collector: auth.currentUser
                            ? auth.currentUser.email
                            : "Unknown Collector"
                    }
                );

            alert("Task Accepted");

            loadRequests();
        });

    });

}

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const searchTerm =
            searchInput.value.toLowerCase();

        const rows =
            document.querySelectorAll("#requestsTable tr");

        rows.forEach(row => {

            const cells =
                row.querySelectorAll("td");

            let match = false;

            cells.forEach(cell => {

                const text =
                    cell.textContent.toLowerCase();

                if(text.includes(searchTerm)) {

                    match = true;

                }

            });

            row.style.display =
                match ? "table-row" : "none";

        });

    });

}

loadRequests();
