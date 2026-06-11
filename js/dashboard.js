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

        const activityList =
            document.getElementById("recentActivity");

        if (recentRequests) {
            recentRequests.innerHTML = "";
        }

        if (activityList) {
            activityList.innerHTML = "";
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

                collector:
                    data.collector || "",

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

        // Sort newest first

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

        // Recent Requests

        if (recentRequests) {

            requests
                .slice(0, 5)
                .forEach((request) => {

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

        // Recent Activity

        if (activityList) {

            requests
                .slice(0, 10)
                .forEach((request) => {

                    let activity = "";

                    if (
                        request.status ===
                        "Completed"
                    ) {

                        activity =
                        `${request.collector || "Collector"} completed a ${request.wasteType} collection`;

                    }
                    else if (
                        request.status ===
                        "Assigned"
                    ) {

                        activity =
                        `${request.collector || "Collector"} accepted a ${request.wasteType} request`;

                    }
                    else {

                        activity =
                        `New ${request.wasteType} request created`;

                    }

                    activityList.innerHTML += `
                    <li>${activity}</li>
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