const role =
    localStorage.getItem("role");

if(role === "collector") {

    document
        .getElementById("dashboardMenu")
        ?.remove();

    document
        .getElementById("newRequestMenu")
        ?.remove();

    document
        .getElementById("reportsMenu")
        ?.remove();

    document
        .getElementById("collectorMenu")
        ?.remove();

}