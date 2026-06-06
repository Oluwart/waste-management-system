import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadDashboard() {

    try {

        let total = 0;
        let pending = 0;
        let assigned = 0;
        let completed = 0;
        let co2Saved = 0;

        const recentRequests =
            document.getElementById("recentRequests");

        if (recentRequests) {
            recentRequests.innerHTML = "";
        }

        const querySnapshot =
            await getDocs(collection(db, "wasteRequests"));

        let requests = [];

        querySnapshot.forEach((requestDoc) => {

            const data = requestDoc.data();

            requests.push({
                id: requestDoc.id,
                ...data
            });

            total++;

            if (data.status === "Pending") {
                pending++;
            }

            if (data.status === "Assigned") {
                assigned++;
            }

            if (data.status === "Completed") {
                completed++;
                co2Saved += 2;
            }

        });

        // Dashboard Cards

        document.getElementById("totalRequests").textContent =
            total;

        document.getElementById("pendingRequests").textContent =
            pending;

        document.getElementById("assignedRequests").textContent =
            assigned;

        document.getElementById("completedRequests").textContent =
            completed;

        document.getElementById("co2Saved").textContent =
            `${co2Saved} kg`;

        document.getElementById("totalWaste").textContent =
            completed;

        document.getElementById("communityRequests").textContent =
            total;

        // Recent Requests

        requests.reverse();

        requests.slice(0, 5).forEach((request) => {

            if (!recentRequests) return;

            recentRequests.innerHTML += `
                <tr>
                    <td>${request.wasteType || "-"}</td>
                    <td>${request.quantity || "-"}</td>
                    <td>${request.location || "-"}</td>
                    <td>${request.status || "-"}</td>
                </tr>
            `;

        });

    }
    catch (error) {

        console.error("Dashboard Error:", error);

    }

}

loadDashboard();