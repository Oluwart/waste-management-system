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
            await getDocs(
                collection(db, "wasteRequests")
            );

        const requests = [];

        querySnapshot.forEach((requestDoc) => {

            const data =
                requestDoc.data();

            requests.push({

                id: requestDoc.id,

                wasteType:
                    data.wasteType || "-",

                quantity:
                    data.quantity || "-",

                location:
                    data.location || "-",

                status:
                    data.status || "-",

                createdAt:
                    data.createdAt || null

            });

            total++;

            if (data.status === "Pending") {

                pending++;

            }

            else if (
                data.status === "Assigned"
            ) {

                assigned++;

            }

            else if (
                data.status === "Completed"
            ) {

                completed++;
                co2Saved += 2;

            }

        });

        // Sort newest requests first

        requests.sort((a, b) => {

            if (
                a.createdAt &&
                b.createdAt
            ) {

                return (
                    b.createdAt.toMillis() -
                    a.createdAt.toMillis()
                );

            }

            if (a.createdAt) return -1;

            if (b.createdAt) return 1;

            return 0;

        });

        // Dashboard Cards

        document.getElementById(
            "totalRequests"
        ).textContent = total;

        document.getElementById(
            "pendingRequests"
        ).textContent = pending;

        document.getElementById(
            "assignedRequests"
        ).textContent = assigned;

        document.getElementById(
            "completedRequests"
        ).textContent = completed;

        document.getElementById(
            "co2Saved"
        ).textContent =
            `${co2Saved} kg`;

        document.getElementById(
            "totalWaste"
        ).textContent =
            completed;

        document.getElementById(
            "communityRequests"
        ).textContent =
            total;

        // Recent Requests Table

        if (recentRequests) {

            const latestRequests =
                requests.slice(0, 5);

            latestRequests.forEach((request) => {

                recentRequests.innerHTML += `
                <tr>
                    <td>${request.wasteType}</td>
                    <td>${request.quantity}</td>
                    <td>${request.location}</td>
                    <td>${request.status}</td>
                </tr>
                `;

            });

        }

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}

loadDashboard();