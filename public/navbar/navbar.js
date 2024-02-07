const loginBtn = document.querySelector('.login-btn')
const logoutBtn = document.querySelector('.logout-btn')
const displayName = document.querySelector('#display-name')


// -- ------------------------------Toggle Button Code and Logout button------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    //----------------- logout button code start -----------------------------------------------------
    try {
        const res = await fetch('/auth/checkAuth', {
            method: 'GET',
        })
        const data = await res.json()
        console.log(data) 
        if(data.name){
            loginBtn.style.display = 'none'
            logoutBtn.style.display = 'block'
            displayName.innerHTML = `<h3 id="username">Hello ${data.name}</h3>`
        }
        
    } catch (error) {
        console.log(error)
    }
    //----------------- logout button code end -----------------------------------------------------

    var icon = document.getElementById("icon");
    var navbarToggleBtn = document.getElementById("navbarToggleBtn");
    var navbarContent = document.querySelector(".navbar-collapse");
    navbarToggleBtn.addEventListener('click', function () {
        navbarContent.classList.toggle("show");
    });
});


// --------------------------------Dark Mode Code----------------------------------------------------------------------
// icon.onclick = function () {
//     document.body.classList.toggle("dark-theme");

//     // Update the icon text and style based on the theme
//     var iconSpan = icon.querySelector('span');
//     if (document.body.classList.contains("dark-theme")) {
//         iconSpan.textContent = 'light_mode';
//     } else {
//         iconSpan.textContent = 'dark_mode';
//     }
// }
// ---------------------------------------------------------------------------------------------------------------