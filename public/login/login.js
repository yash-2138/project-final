const container=document.querySelector('.container');
const LoginLink=document.querySelector('.SignInLink')
const RegisterLink=document.querySelector('.SignUpLink')

const loginBtn = document.querySelector('#submit-btn-login')
const registerBtn = document.querySelector('#submit-btn-register')

RegisterLink.addEventListener('click',()=>{
    container.classList.add('active');
    let errorMessages = document.getElementById('errorMessages-login');
    errorMessages.innerHTML = '';
})
LoginLink.addEventListener('click',()=>{
    container.classList.remove('active');
    let errorMessages = document.getElementById('errorMessages-register');
    errorMessages.innerHTML = '';
})

loginBtn.addEventListener('click', async(event)=>{
    event.preventDefault()
    const emailLogin = document.querySelector('#email-login').value
    const passLogin = document.querySelector('#password-login').value
    if(!validateLogin(emailLogin,passLogin)){
        return 
    }
    let errorMessages = document.getElementById('errorMessages-login');
    errorMessages.innerHTML = '';

    console.log(emailLogin, passLogin)
    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({email: emailLogin, password: passLogin}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        console.log(data)
        if(data.error){
            errorMessages.innerHTML = data.error;
        }
        if(data.user){
            location.assign('/home')
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
    const confirmPassword = document.querySelector("#confirm-password-register").value
    const type = document.querySelector('#storageType').value
    console.log(name, email, pass, type)
    if(!validateRegistration(name, email,pass, confirmPassword)){
        return 
    }
    try {
        let errorMessages = document.getElementById('errorMessages-register');
        errorMessages.innerHTML = '';
        const res = await fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({name:name,email: email, password: pass, type: type}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await res.json()
        console.log(data)
        if(data.type === "already registered"){
            errorMessages.innerHTML += 'Email already in use.';
            return
        }
        if(data.msg == "success"){
            alert("Registration Success")
            container.classList.remove('active');
        }
    } catch (error) {
        console.log(error)
        
    }
})

function validateLogin(email, password) {
    let errorMessages = document.getElementById('errorMessages-login');
    errorMessages.innerHTML = '';

    // Validate email
    if (email.trim() === '') {
      errorMessages.innerHTML += 'Please enter a email.';
      return false;
    }
    else if (!isValidEmail(email)) {
        errorMessages.innerHTML += 'Please enter a valid email address.';
        return false
    }

    // Validate password
    if (password.trim() === '') {
      errorMessages.innerHTML += 'Please enter a password.';
      
    }

    // Check if there are any error messages
    if (errorMessages.innerHTML === '') {
      // If no errors, submit the form (you may want to add AJAX code here for real-world scenarios)
        return true;
    }
    else{
        return false;
    }
}

function validateRegistration(name,email, password,confirmPassword){
    let errorMessages = document.getElementById('errorMessages-register');
    errorMessages.innerHTML = '';

    // Validate name
    if (name.trim() === '') {
        errorMessages.innerHTML += 'Please enter your name.';
        return false
    }

    // Validate email
    if (email.trim() === '') {
        errorMessages.innerHTML += 'Please enter an email address.';
        return false
    } else if (!isValidEmail(email)) {
        errorMessages.innerHTML += 'Please enter a valid email address.';
        return false
    }

    // Validate password
    if (password.trim() === '') {
        errorMessages.innerHTML += 'Please enter a password.';
        return false
    } else if (password.length < 8) {
        errorMessages.innerHTML += 'Password must be at least 8 characters long.';
        return false
    }

    // Validate confirm password
    if (confirmPassword.trim() === '') {
        errorMessages.innerHTML += 'Please confirm your password.';
        return false
    } else if (password !== confirmPassword) {
        errorMessages.innerHTML += 'Passwords do not match.';
        return false
    }

    // Check if there are any error messages
    if (errorMessages.innerHTML === '') {
        return true;
    }else{
        return false;
    }
}

function isValidEmail(email) {
// Simple email validation using a regular expression
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}