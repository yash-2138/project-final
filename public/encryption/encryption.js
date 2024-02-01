
const generateBtn = document.querySelector("#btn1")
const encryptBtn = document.querySelector("#encrypt-btn")
const decryptBtn = document.querySelector("#decrypt-btn")

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
        const key = data.key
        // console.log(key.data)
        const blob = new Blob([key], { type: 'text/plain', encoding: 'utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'secretKey.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
    .catch(error => console.error('Error:', error));
})


encryptBtn.addEventListener('click',async ()=>{
    const inputFile = document.querySelector('#originalFile').files[0]
    const key = document.querySelector('#key-enc').value
    console.log(key)
    if (!key || !inputFile) {
        alert('Please select both key and input file.');
        return;
    }
    const formData = new FormData();
    formData.append('keyFile', key);
    formData.append('inputFile', inputFile)

    try {
        fetch('http://localhost:5000/service/encryptFile', {
            method: 'POST',
            
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const filenamePart = contentDispositionHeader.split('=')[1];
            const filename = filenamePart.trim();
            console.log(filename);
            return response.blob().then(blob => {
                // Directly download the blob with the original filename
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }) 
        
    } catch (error) {
        console.error('Error:', error);
    }
})

decryptBtn.addEventListener('click',async ()=>{
    const encryptedFile = document.querySelector('#encryptedFile').files[0]
    const key = document.querySelector('#key-dec').value
    console.log(key)
    if (!key || !encryptedFile) {
        alert('Please select both key and input file.');
        return;
    }
    const formData = new FormData();
    formData.append('keyFile', key);
    formData.append('encryptedFile', encryptedFile)

    try {
        fetch('http://localhost:5000/service/decryptFile', {
            method: 'POST',
            
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentDispositionHeader = response.headers.get('Content-Disposition');
            const filenamePart = contentDispositionHeader.split('=')[1];
            const filename = filenamePart.trim();
            console.log(filename);
            return response.blob().then(blob => {
                // Directly download the blob with the original filename
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            });
        }) 
        
    } catch (error) {
        console.error('Error:', error);
    }
})
