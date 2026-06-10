import { db } from "./firebase-config.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form =
    document.getElementById("requestForm");

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const wasteType =
            document.getElementById(
                "wasteType"
            ).value;

        const quantity =
            document.getElementById(
                "quantity"
            ).value;

        const location =
            document.getElementById(
                "location"
            ).value;

        try {

            await addDoc(
                collection(
                    db,
                    "wasteRequests"
                ),
                {
                    wasteType,
                    quantity,
                    location,
                    status: "Pending",
                    createdAt: new Date()
                }
            );

            alert(
                "Waste request submitted successfully!"
            );

            form.reset();

        }
        catch (error) {

            console.error(error);

            alert(
                "Error submitting request"
            );

        }

    }
);