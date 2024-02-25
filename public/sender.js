// let myId = 'yash-gmail-com'
// let receiverId = '222-222-222'
let myId
let receiverId
let peer
let email = document.querySelector('#email').innerText
let type = document.querySelector('#type').innerText

if(type == 'DO'){
    const receiverEmail = () =>{
        return new Promise(async (resolve, reject) =>{
            try {
                const res = await fetch('/crud/getMyStorageProvider',{
                    method: 'GET'
                })
    
                const data = await res.json()
                resolve(data.email)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
    
    receiverEmail()
        .then((data) =>{
            receiverId = data.split('@')[0] + '-receiver'
        })
        .catch((error) =>{
            console.log(error)
        })
}
else if(type == 'SO'){
    const receiverEmail = () =>{
        return new Promise(async (resolve, reject) =>{
            try {
                const res = await fetch('/crud/getMyDataOwner',{
                    method: 'GET'
                })
    
                const data = await res.json()
                resolve(data.email)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
    
    receiverEmail()
        .then((data) =>{
            receiverId = data.split('@')[0] + '-receiver'
            // console.log(receiverId)
        })
        .catch((error) =>{
            console.log(error)
        })
}




// console.log(email)
myId = email.split('@')[0] + '-sender'
peer = new Peer(myId);
peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    document.querySelector("#join-id").innerHTML = `
        <b>My Id :</b>
        <span>${myId}</span>
    `
});

    
peer.on('connection', (conn) => {
    console.log('Connected to peer:', conn.peer);
    // document.querySelector(".fs-screen").classList.remove("inactive")
    document.querySelector('#connected-peer').innerHTML =   `
        <b>Connected Peer Id: </b>
        <span>${conn.peer}</span>
    `
    
});

    
      
let file
let hash = ''
let chunkSize = 16384; // 16 KB chunks, you can adjust this size based on your requirements

document.querySelector("#file-input").addEventListener("change", function (e) {
    file = e.target.files[0];

    if (!file) {
        return;
    }

    const conn = peer.connect(receiverId);
    conn.on('open', () => {
        console.log('Connected to peer:', receiverId);

        let el = document.createElement("div");
        el.classList.add("item");
        el.innerHTML = `
            <div class="progress">0%</div>
            <div class="filename">${file.name}</div>
        `;
        document.querySelector(".files-list").appendChild(el);

        const metadata = {
            type: 'metadata',
            fileName: file.name,
            fileSize: file.size,
        };

        conn.send(metadata);

        const reader = new FileReader();
        let offset = 0;

        reader.onload = function (event) {
            let buffer = new Uint8Array(reader.result);
            hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer));
            const fileData = {
                type: 'file',
                fileName: file.name,
                fileSize: file.size,
                content: event.target.result,
                offset: offset,
            };
            conn.send(fileData);

            offset += event.target.result.byteLength;

            if (offset < file.size) {
                readSlice(offset);
            }
            if(offset === file.size){
                updateProgressBar(100)
                addFileHash()
            }
        };

        function readSlice(start) {
            const slice = file.slice(start, start + chunkSize);
            reader.readAsArrayBuffer(slice);
        
            // Calculate the percentage and call updateProgressBar
            const percentage = (start / file.size) * 100;
            updateProgressBar(percentage);
        }
        readSlice(0);
    });
});

// Add the following function in sender.js
function updateProgressBar(percentage) {
    const progressBar = document.querySelector('.progress');
    progressBar.innerHTML = percentage.toFixed(2) + '%';
    // console.log(progressBar.innerHTML)
}

function addFileHash(){
    let data = {
        fileName: file.name,
        hash: hash.toString(),
        size: file.size
    }
    hash = ''
    // console.log(data)
    fetch("http://localhost:5000/crud/addFiles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add any other headers if needed
        },
        body: JSON.stringify({data}),
    })
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);
            // Handle the API response here
        })
        .catch(error => {
            console.error("API error:", error);
            // Handle the API error here
        });
}


