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

document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        exportCompletedCollections
    );

async function exportCompletedCollections() {

    const querySnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    let csvContent =
        "Request ID,Waste Type,Quantity,Location,Collector,Date Completed\n";

    querySnapshot.forEach((requestDoc) => {

        const data =
            requestDoc.data();

        if (
            data.status === "Completed"
        ) {

            let completedDate =
                "";

            if (data.completedAt) {

                completedDate =
                    data.completedAt
                    .toDate()
                    .toLocaleDateString();

            }

            csvContent +=
                `"${requestDoc.id}",` +
                `"${data.wasteType || ""}",` +
                `"${data.quantity || ""}",` +
                `"${data.location || ""}",` +
                `"${data.collector || ""}",` +
                `"${completedDate}"\n`;

        }

    });

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                "text/csv;charset=utf-8;"
            }
        );

    const link =
        document.createElement("a");

    const url =
        URL.createObjectURL(blob);

    link.href = url;

    link.download =
        "completed_collections.csv";

    link.click();

    URL.revokeObjectURL(url);

}

document
    .getElementById("excelBtn")
    .addEventListener(
        "click",
        exportToExcel
    );

async function exportToExcel() {

    const querySnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    const reportData = [];

    querySnapshot.forEach((requestDoc) => {

        const data =
            requestDoc.data();

        if (
            data.status === "Completed"
        ) {

            let completedDate =
                "N/A";

            if (
                data.completedAt
            ) {

                completedDate =
                    data.completedAt
                    .toDate()
                    .toLocaleDateString();

            }

            reportData.push({

                "Request ID":
                    requestDoc.id,

                "Waste Type":
                    data.wasteType,

                "Quantity":
                    data.quantity,

                "Location":
                    data.location,

                "Collector":
                    data.collector ||
                    "Not Assigned",

                "Date Completed":
                    completedDate

            });

        }

    });

    const worksheet =
        XLSX.utils.json_to_sheet(
            reportData
        );

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Completed Collections"
    );

    XLSX.writeFile(
        workbook,
        "WasteMS_Report.xlsx"
    );

}