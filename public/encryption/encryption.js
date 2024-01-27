
const generateBtn = document.querySelector("#btn1")

generateBtn.addEventListener('click', ()=>{
    fetch('http://localhost:5000/service/getKey',{
        method: "GET"
    })
    .then(response =>{
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data=>{
        const blob = new Blob([key], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'secretKey.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    .catch(error => console.error('Error:', error));
})