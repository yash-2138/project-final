(function(){
    let receiverId;
    const socket = io()

    function generateId(){
        return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`
    }

    document.querySelector("#sender-start-con-btn").addEventListener("click", function(){
        let joinId =generateId()
        document.querySelector("#join-id").innerHTML = `
            <b>Room Id</b>
            <span>${joinId}</span>
        `
        socket.emit("sender-join", {
            uid: joinId
        })

        socket.on("init", function(uid){
            receiverId = uid;
            document.querySelector(".join-screen").classList.remove("active")
            document.querySelector(".fs-screen").classList.add("active")
        })
    })  
    let file
    document.querySelector("#file-input").addEventListener("change", function (e) {
        file = e.target.files[0];
    
        if (!file) {
            return;
        }
    
        let reader = new FileReader();
    
        reader.onload = function (e) {
            let buffer = new Uint8Array(reader.result);
    
            let el = document.createElement("div");
            el.classList.add("item");
            el.innerHTML = `
                <div class="progress">0%</div>
                <div class="filename">${file.name}</div>
            `;
    
            document.querySelector(".files-list").appendChild(el);
    
            // Emit "file-meta" event with file metadata
            socket.emit("file-meta", {
                uid: receiverId,
                metadata: {
                    filename: file.name,
                    total_buffer_size: buffer.length,
                    buffer_size: 1024,
                },
            });
    
            shareFile(buffer, el.querySelector(".progress"));
        };
    
        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
    
    function shareFile(buffer, progress_node) {
        // Calculate the total number of chunks
        const totalChunks = Math.ceil(buffer.length / 1024);
        
        // Counter to keep track of the chunks sent
        let sentChunks = 0;
    
        // Listens for "fs-share" event and shares the file in chunks
        socket.on("fs-share", function () {
            let chunk = buffer.slice(0, 1024); // Adjust the chunk size as needed
            buffer = buffer.slice(chunk.length, buffer.length);
    
            sentChunks++;
    
            const progress = (sentChunks / totalChunks) * 100;
            progress_node.innerText = progress.toFixed(2) + "%";
    
            if (chunk.length !== 0) {
                // Emit "file-raw" event with file buffer chunk
                socket.emit("file-raw", {
                    uid: receiverId,
                    buffer: chunk,
                });
            } else {
                // File transfer is completed, you can perform any cleanup or UI updates here
                progress_node.innerText = "100%";
            }
        });
    }
    
    
})()