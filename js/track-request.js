import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

document
.getElementById("trackBtn")
.addEventListener("click", trackRequest);

async function trackRequest() {

const phone =
    document.getElementById("phoneNumber")
    .value
    .trim();

const result =
    document.getElementById("trackingResult");

result.innerHTML = "";

if (!phone) {

    alert("Enter your phone number");

    return;

}

try {

    const querySnapshot =
        await getDocs(
            collection(db, "wasteRequests")
        );

    let latestRequest = null;

    querySnapshot.forEach((doc) => {

        const data = doc.data();

        if (data.phone === phone) {

            if (
                !latestRequest ||
                (
                    data.createdAt &&
                    latestRequest.createdAt &&
                    data.createdAt.toMillis() >
                    latestRequest.createdAt.toMillis()
                )
            ) {

                latestRequest = {
                    id: doc.id,
                    ...data
                };

            }

        }

    });

    if (!latestRequest) {

        result.innerHTML = `
            <div class="tracking-card">
                <h3>No Request Found</h3>
                <p>
                    No waste collection request was found for this phone number.
                </p>
            </div>
        `;

        return;

    }

    result.innerHTML = `

        <div class="tracking-card">

            <h3>Request Status</h3>

            <p>
                <strong>Name:</strong>
                ${latestRequest.fullName || "-"}
            </p>

            <p>
                <strong>Phone:</strong>
                ${latestRequest.phone || "-"}
            </p>

            <p>
                <strong>Waste Type:</strong>
                ${latestRequest.wasteType || "-"}
            </p>

            <p>
                <strong>Quantity:</strong>
                ${latestRequest.quantity || "-"}
            </p>

            <p>
                <strong>Location:</strong>
                ${latestRequest.location || "-"}
            </p>

            <p>
                <strong>Status:</strong>

                <span class="status-badge ${latestRequest.status.toLowerCase()}">
                    ${latestRequest.status}
                </span>
            </p>

            <p>
                <strong>Collector:</strong>
                ${latestRequest.collector || "Not Assigned"}
            </p>

            <div class="timeline">

                <div class="timeline-step active">
                    ✓ Request Submitted
                </div>

                <div class="timeline-step ${
                    latestRequest.status === "Assigned" ||
                    latestRequest.status === "Completed"
                        ? "active"
                        : ""
                }">
                    ✓ Accepted By Collector
                </div>

                <div class="timeline-step ${
                    latestRequest.status === "Completed"
                        ? "active"
                        : ""
                }">
                    ✓ Waste Collected
                </div>

            </div>

        </div>

    `;

}
catch (error) {

    console.error(error);

    result.innerHTML = `
        <div class="tracking-card">
            <h3>Error</h3>
            <p>
                Failed to load request information.
            </p>
        </div>
    `;

}


}
