(function () {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short"
    });

    function updateEasternTime() {
        const currentEasternTime = formatter.format(new Date());

        document.querySelectorAll("[data-eastern-time], #lastmodbox").forEach((element) => {
            element.textContent = currentEasternTime;
        });

        document.querySelectorAll("#lastmodbox2").forEach((element) => {
            element.innerHTML = '<font color="white">Running: </font>' + currentEasternTime;
        });
    }

    updateEasternTime();
    window.setInterval(updateEasternTime, 1000);
}());
