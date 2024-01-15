const container=document.querySelector('.container');
const LoginLink=document.querySelector('.SignInLink')
const RegisterLink=document.querySelector('.SignUpLink')

const loginBtn = document.querySelector('#submit-btn-login')
const registerBtn = document.querySelector('#submit-btn-register')

RegisterLink.addEventListener('click',()=>{
    container.classList.add('active');
})
LoginLink.addEventListener('click',()=>{
    container.classList.remove('active');
})

loginBtn.addEventListener('click', async(event)=>{
    event.preventDefault()
    const emailLogin = document.querySelector('#email-login').value
    const passLogin = document.querySelector('#password-login').value
    console.log(emailLogin, passLogin)
    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({email: emailLogin, password: passLogin}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        console.log(data)
        if(data.user){
            location.assign('/home.html')
        }
    } catch (error) {
        console.log(error)
    }
})

registerBtn.addEventListener('click', async(event)=>{
    event.preventDefault()
    const name = document.querySelector('#name-register').value
    const email = document.querySelector('#email-register').value
    const pass = document.querySelector('#password-register').value
    console.log(name, email, pass)
    try {
        const res = await fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({name:name,email: email, password: pass}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        console.log(data)
        if(data.type === "already registered"){
            container.classList.remove('active');
            return
        }
        if(data.user){
            location.assign('/home.html')
        }
    } catch (error) {
        console.log(error)
        
    }
})