const connectionButton = document.querySelector('#receiver-start-con-btn')
const email = document.querySelector('#email').innerText
const myId = email.split('@')[0] + '-receiver'
// console.log(myId)
const peer = new Peer(myId);
let receivedChunks = [];
let receivedFiles = [];
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
            handleData(data, conn);
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



function handleData(data, conn) {

    receivedChunks.push(data.content);
    receivedBytes += data.content.byteLength;

    if (receivedBytes === totalBytes) {
        const mergedArrayBuffer = new Uint8Array(receivedBytes);
        let offset = 0;

        receivedChunks.forEach((chunk) => {
            mergedArrayBuffer.set(new Uint8Array(chunk), offset);
            offset += chunk.byteLength;
        });

        const blob = new Blob([mergedArrayBuffer]);
        const url = window.URL.createObjectURL(blob);

        receivedFiles.push({ url, fileName: data.fileName });

        displayReceivedFiles();
        updateProgressBar();
        conn.send({ type: 'progress', percentage: 100 });
        receivedChunks = [];
        receivedBytes = 0;
    } else {
        updateProgressBar();
        const percentage = (receivedBytes / totalBytes) * 100;
        conn.send({ type: 'progress', percentage });
    }
}

function displayReceivedFiles() {
    const fileListElement = document.getElementById('file-list');
    fileListElement.innerHTML = ''; // Clear the existing list

    receivedFiles.forEach((file) => {
        console.log(file)
        const listItem = document.createElement('li');
        const downloadLink = document.createElement('a');
        
        downloadLink.href = file.url;
        downloadLink.download = file.fileName;
        downloadLink.textContent = file.fileName;

        listItem.appendChild(downloadLink);
        fileListElement.appendChild(listItem);
    });
}



