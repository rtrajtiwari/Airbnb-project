document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon"); 
    const body = document.body;

    // Check if the user already has a preference stored
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeIcon.classList.replace("fa-moon", "fa-sun"); 
    }

    toggleButton.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            themeIcon.classList.replace("fa-moon", "fa-sun"); 
            localStorage.setItem("theme", "dark");
        } else {
            themeIcon.classList.replace("fa-sun", "fa-moon"); 
            localStorage.setItem("theme", "light");
        }
    });
});
