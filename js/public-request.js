import { db }
from "./firebase-config.js";

import {
collection,
addDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const form =
document.getElementById(
"publicRequestForm"
);

form.addEventListener(
"submit",
async (e) => {

    e.preventDefault();

    const fullName =
        document.getElementById(
            "fullName"
        ).value;

    const phone =
        document.getElementById(
            "phone"
        ).value;

    const location =
        document.getElementById(
            "location"
        ).value;

    const wasteType =
        document.getElementById(
            "wasteType"
        ).value;

    const quantity =
        document.getElementById(
            "quantity"
        ).value;

    try {

        await addDoc(
            collection(
                db,
                "wasteRequests"
            ),
            {
                fullName,
                phone,
                location,
                wasteType,
                quantity,
                status: "Pending",
                createdAt: new Date()
            }
        );

        alert(
            "Request Submitted Successfully"
        );

        form.reset();

    }
    catch(error){

        console.error(error);

        alert(
            "Failed To Submit Request"
        );

    }

}

);
