
const loginBtn = document.querySelector('.login-btn')
const logoutBtn = document.querySelector('.logout-btn')
const displayName = document.querySelector('#display-name')




document.addEventListener('DOMContentLoaded', function () {
    var icon = document.getElementById("icon");
    var currentTheme = localStorage.getItem("theme");
    var navbarToggleBtn = document.getElementById("navbarToggleBtn");
    var navbarContent = document.querySelector(".navbar-collapse");
    try {
        const res = await fetch('/auth/checkAuth', {
            method: 'GET',
        })
        const data = await res.json()
        console.log(data) 
        if(data.name){
            loginBtn.style.display = 'none'
            logoutBtn.style.display = 'block'
            displayName.innerHTML = `<h3>Hello ${data.name}</h3>`
        }
        // else{
        //     console.log('loggedout')
        // }
        
    } catch (error) {
        console.log(error)
    }
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
      navbarToggleBtn.addEventListener('click', function () {
        navbarContent.classList.toggle("show");
    });

    function updateIconText(theme) {
        var iconSpan = icon.querySelector('span');
        iconSpan.textContent = theme === "dark-theme" ? 'light_mode' : 'dark_mode';
    }
});

