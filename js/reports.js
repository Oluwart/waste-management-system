import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

async function loadReports() {

    let totalRequests = 0;
    let pendingRequests = 0;
    let assignedTasks = 0;
    let completedTasks = 0;

    let plasticCount = 0;
    let organicCount = 0;
    let metalCount = 0;
    let paperCount = 0;
    let glassCount = 0;

    let collectorStats = {};

    // Load waste requests
    const requestsSnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    requestsSnapshot.forEach((requestDoc) => {

        const data = requestDoc.data();

        totalRequests++;

        // Status counts
        if (data.status === "Pending") {
            pendingRequests++;
        }

        if (data.status === "Assigned") {
            assignedTasks++;
        }

        if (data.status === "Completed") {

            completedTasks++;

            if (data.collector) {

                collectorStats[data.collector] =
                    (collectorStats[data.collector] || 0) + 1;

            }

        }

        // Waste type counts
        if (data.wasteType) {

            const wasteType =
                data.wasteType.toLowerCase();

            if (wasteType === "plastic") {
                plasticCount++;
            }

            if (wasteType === "organic") {
                organicCount++;
            }

            if (wasteType === "metal") {
                metalCount++;
            }

            if (wasteType === "paper") {
                paperCount++;
            }

            if (wasteType === "glass") {
                glassCount++;
            }

        }

    });

    // Find top collector
    let topCollectorEmail = "";
    let highestCount = 0;

    for (const collector in collectorStats) {

        if (
            collectorStats[collector] >
            highestCount
        ) {

            highestCount =
                collectorStats[collector];

            topCollectorEmail =
                collector;

        }

    }

    // Get collector details
    let topCollectorName = "N/A";
    let topCollectorRole = "Waste Collector";

    if (topCollectorEmail) {

        const usersSnapshot =
            await getDocs(
                collection(db, "users")
            );

        usersSnapshot.forEach((userDoc) => {

            const userData =
                userDoc.data();

            if (
                userData.email ===
                topCollectorEmail
            ) {

                topCollectorName =
                    userData.name ||
                    topCollectorEmail;

                topCollectorRole =
                    userData.role === "admin"
                    ? "Administrator"
                    : "Waste Collector";

            }

        });

    }

    // Report Cards
    document.getElementById("totalRequests")
        .textContent = totalRequests;

    document.getElementById("pendingRequests")
        .textContent = pendingRequests;

    document.getElementById("assignedTasks")
        .textContent = assignedTasks;

    document.getElementById("completedTasks")
        .textContent = completedTasks;

    document.getElementById("plasticWaste")
        .textContent = plasticCount;

    document.getElementById("organicWaste")
        .textContent = organicCount;

    document.getElementById("co2Saved")
        .textContent =
        `${completedTasks * 2} kg`;

    // Top Collector Card
    document.getElementById("topCollectorName")
        .textContent =
        topCollectorName;

    document.getElementById("topCollectorRole")
        .textContent =
        topCollectorRole;

    document.getElementById("topCollectorCount")
        .textContent =
        highestCount;

    document.getElementById("topCollectorAvatar")
        .textContent =
        topCollectorName
            .charAt(0)
            .toUpperCase();

    // Pie Chart
    const ctx =
        document.getElementById("wasteChart");

    new Chart(ctx, {

        type: "pie",

        data: {

            labels: [
                "Plastic",
                "Organic",
                "Metal",
                "Paper",
                "Glass"
            ],

            datasets: [{

                data: [
                    plasticCount,
                    organicCount,
                    metalCount,
                    paperCount,
                    glassCount
                ]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }
    });

}

loadReports();