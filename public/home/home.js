const loginBtn = document.querySelector('.login-btn')
const logoutBtn = document.querySelector('.logout-btn')
const displayName = document.querySelector('#display-name')


document.addEventListener('DOMContentLoaded', async function () {
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
        // else{
        //     console.log('loggedout')
        // }
        
    } catch (error) {
        console.log(error)
    }
   
});