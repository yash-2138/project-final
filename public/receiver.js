const connectionButton = document.querySelector('#receiver-start-con-btn')
const email = document.querySelector('#email').innerText
const myId = email.split('@')[0] + '-receiver'
// console.log(myId)
const peer = new Peer(myId);
const receivedChunks = [];
let totalBytes = 0;
let receivedBytes = 0;

peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    document.querySelector('#myId').innerHTML = id;
});

peer.on('connection', (conn) => {
    console.log('Sender added: ', conn.peer);
    document.querySelector('#connected-peer').innerHTML = `
        <b>Connected Peer Id: </b>
        <span>${conn.peer}</span>
    `;

    conn.on('data', (data) => {
        if (data.type === 'metadata') {
            totalBytes = data.fileSize;
        } else if (data.type === 'file') {
            handleData(data);
        }
    });
});

function updateProgressBar() {
    const progressBar = document.getElementById('file-progress');
    
    // Check if totalBytes is 0 to avoid division by zero
    if(totalBytes === 0){
        progressBar.style.width = '100%';
        progressBar.innerHTML = '100%'
    }
    else if (receivedBytes === 0) {
        progressBar.style.width = '0%';
        progressBar.innerHTML = '0%';
    } 
    else {
        const percentage = (receivedBytes / totalBytes) * 100;
        // console.log(percentage, receivedBytes, totalBytes);
        progressBar.style.width = percentage.toFixed(2) + '%';
        progressBar.innerHTML = `${percentage.toFixed(2)}%`;
    }
}


function handleData(data) {
    // console.log('Received file data:', data);

    receivedChunks.push(data.content);
    receivedBytes += data.content.byteLength;

    if (receivedBytes === totalBytes) {
        // All chunks received, assemble the file
        const mergedArrayBuffer = new Uint8Array(receivedBytes);
        let offset = 0;

        receivedChunks.forEach((chunk) => {
            mergedArrayBuffer.set(new Uint8Array(chunk), offset);
            offset += chunk.byteLength;
        });

        const blob = new Blob([mergedArrayBuffer]);
        const url = window.URL.createObjectURL(blob);

        // Create a list item with a link to trigger the download
        const filesList = document.querySelector('.files-list');
        const listItem = document.createElement('li');
        const downloadLink = document.createElement('a');
        
        downloadLink.href = url;
        downloadLink.download = data.fileName;
        downloadLink.textContent = data.fileName;

        listItem.appendChild(downloadLink);
        filesList.appendChild(listItem);

        // Optionally, you can also reset the progress bar
        updateProgressBar();
    } else {
        // Update progress bar for partial file reception
        updateProgressBar();
    }
}

