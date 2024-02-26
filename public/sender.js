// let myId = 'yash-gmail-com'
// let receiverId = '222-222-222'
let myId
let receiverId
let peer
let conn
let receiverEmail
let email = document.querySelector('#email').innerText
let type = document.querySelector('#type').innerText
const reqConnBtn = document.querySelector('#request-conn-btn')
const connectedPeerText = document.querySelector('#connected-peer')
const fsScreen = document.querySelector('.fs-screen')

myId = email.split('@')[0] + '-sender'
peer = new Peer(myId);
peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    document.querySelector("#join-id").innerHTML = myId
});


if(type == 'DO'){
    receiverEmail = () =>{
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
}
else if(type == 'SO'){
    receiverEmail = () =>{
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
    
}

receiverEmail()
        .then((data) =>{
            receiverId = data.split('@')[0] + '-receiver'
            // console.log(receiverId)
            // receiverId = 'd-receiver' //this is temporary remove it
            reqConnBtn.addEventListener('click', async() =>{
                console.log('Sending Connection request....')
                try {
                    const connection = await Promise.race([
                        new Promise((resolve, reject) => {
                          try {
                            conn = peer.connect(receiverId);
                            conn.on('open', () => {
                              console.log("Connection established: ", receiverId);
                              connectedPeerText.innerHTML = receiverId
                              fsScreen.classList.remove('inactive')
                              resolve(conn);
                            });
                          } catch (error) {
                            reject(error);
                          }
                        }),
                        new Promise((_, reject) => {
                          setTimeout(() => {
                            reject(new Error('Connection timed out'));
                          }, 5000); // 5 seconds timeout
                        }),
                    ]);
                } catch (error) {
                    console.error(error)
                    alert(error)
                }
                
                
                
            })
        })
        .catch((error) =>{
            console.log(error)
        })



// console.log(email)

    
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
    let buffer = new Uint8Array(reader.result);
    hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(buffer));
    // if(type == 'SO'){
    //     checkHash()
    // }

    reader.onload =async function (event) {
        
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

const checkHash = ()=>{
    try {
        new Promise((resolve, reject) =>{
            try {
                fetch("http://localhost:5000/crud/checkFileHash", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({hash}),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("API response:", data);
                        resolve(data)
                       
                    })
                    .catch(error => {
                        console.error("API error:", error);
                        new Error(error)
                        reject(error)
                        // Handle the API error here
                    });
            } catch (error) {
                reject(error)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
