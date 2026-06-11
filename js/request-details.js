import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const params =
    new URLSearchParams(
        window.location.search
    );

const requestId =
    params.get("id");

async function loadRequest() {

    try {

        const requestRef =
            doc(
                db,
                "wasteRequests",
                requestId
            );

        const requestSnap =
            await getDoc(
                requestRef
            );

        if (!requestSnap.exists()) {

            alert(
                "Request not found"
            );

            return;

        }

        const data =
            requestSnap.data();

        document.getElementById(
            "requestId"
        ).textContent =
            requestId;

        document.getElementById(
            "wasteType"
        ).textContent =
            data.wasteType || "N/A";

        document.getElementById(
            "quantity"
        ).textContent =
            data.quantity || "N/A";

        document.getElementById(
            "location"
        ).textContent =
            data.location || "N/A";

        document.getElementById(
            "status"
        ).textContent =
            data.status || "N/A";

        document.getElementById(
            "collector"
        ).textContent =
            data.collector ||
            "Not Assigned";

        document.getElementById(
            "createdAt"
        ).textContent =
            data.createdAt
            ? data.createdAt
                .toDate()
                .toLocaleString()
            : "N/A";

        document.getElementById(
            "completedAt"
        ).textContent =
            data.completedAt
            ? data.completedAt
                .toDate()
                .toLocaleString()
            : "N/A";

    }
    catch (error) {

        console.error(error);

    }

}

loadRequest();