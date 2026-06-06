const role =
    localStorage.getItem("role");

const currentPage =
    window.location.pathname
    .split("/")
    .pop();

const collectorPages = [
    "requests.html",
    "tasks.html",
    "completed.html"
];

const adminPages = [
    "dashboard.html",
    "new-request.html",
    "reports.html",
    "create-collector.html"
];

if(role === "collector") {

    if(adminPages.includes(currentPage)) {

        window.location.href =
            "tasks.html";

    }

}