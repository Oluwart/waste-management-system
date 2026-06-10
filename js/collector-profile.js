import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const collectorId =
    params.get("id");

async function loadProfile() {

    const userDoc =
        await getDoc(
            doc(db, "users", collectorId)
        );

    if (!userDoc.exists()) {

        alert("Collector not found");

        return;

    }

    const user =
        userDoc.data();

    document.getElementById(
        "collectorName"
    ).textContent =
        user.name;

    document.getElementById(
        "collectorEmail"
    ).textContent =
        user.email;

    document.getElementById(
        "collectorRole"
    ).textContent =
        "Waste Collector";

    let completedCount = 0;

    const tableBody =
        document.getElementById(
            "jobsTable"
        );

    tableBody.innerHTML = "";

    const requestsSnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    requestsSnapshot.forEach(
        (requestDoc) => {

        const data =
            requestDoc.data();

        if (
            data.status === "Completed" &&
            data.collector === user.email
        ) {

            completedCount++;

            let completedDate =
                "N/A";

            if(data.completedAt){

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

                <td>${completedDate}</td>

            </tr>
            `;
        }

    });

    document.getElementById(
        "completedJobs"
    ).textContent =
        completedCount;

}

loadProfile();