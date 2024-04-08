const loginBtn = document.querySelector('.login-btn')
const logoutBtn = document.querySelector('.logout-btn')
const displayName = document.querySelector('#display-name')


// -- ------------------------------Toggle Button Code and Logout button------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async function () {
    //----------------- logout button code start -----------------------------------------------------
    try {
        const res = await fetch('/auth/getName', {
            method: 'GET',
        })
        const data = await res.json()
        console.log(data) 
        if(data.name){
            loginBtn.style.display = 'none'
            logoutBtn.style.display = 'block'  
        }
        else if(data.msg == "not logged in"){
            loginBtn.style.display = 'block'
        }
        
    } catch (error) {
        console.log(error)
        loginBtn.style.display = 'block'
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

// ------------------------------------------------------Code For DropDown Profile---------------------------------------------------------

function toggleProfileDropdown() {
    var profileDropdown = document.getElementById("profileDropdown");
    profileDropdown.style.display = (profileDropdown.style.display === "block") ? "none" : "block";
  }
  
  
  
  