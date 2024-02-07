document.addEventListener('DOMContentLoaded', function () {
    var icon = document.getElementById("icon");
    var currentTheme = localStorage.getItem("theme");
    console.log('e')

    // Set the initial theme
    if (currentTheme) {
        document.body.classList.add(currentTheme);
        updateIconText(currentTheme);
    }

    icon.onclick = function () {
        document.body.classList.toggle("dark-theme");
        currentTheme = document.body.classList.contains("dark-theme") ? "dark-theme" : "";
        localStorage.setItem("theme", currentTheme);
        updateIconText(currentTheme);
    }

    function updateIconText(theme) {
        icon.innerText = theme === "dark-theme" ? 'light_mode' : 'dark_mode';
    }
});
