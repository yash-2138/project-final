

(function(){
    let senderId;
    const socket = io()

    function generateId(){
        return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`
    }

    document.querySelector("#receiver-start-con-btn").addEventListener("click", function(){
        senderId = document.querySelector("#join-Id").value;
        if(senderId.length == 0){
            return ;
        }
        let joinId =generateId()
       
        socket.emit("receiver-join", {
            uid: joinId,
            sender_uid: senderId
        })
        document.querySelector(".join-screen").classList.remove("active")
         document.querySelector(".fs-screen").classList.add("active")
    })

    let fileShare = {};

    socket.on("fs-meta", function(metadata){
        fileShare.metadata = metadata
        fileShare.transmited = 0
        fileShare.buffer = []

        let el = document.createElement("div")
        el.classList.add("item")
        el.innerHTML = `
            <div class="progress">0%</div>
            <div class="filename">${metadata.filename}</div>
        `
        document.querySelector(".files-list").appendChild(el)
        fileShare.progress_node = el.querySelector(".progress");
        socket.emit("fs-start", {
            uid: senderId
        })
    })
    function downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Set the desired filename here
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      
      
      

    socket.on("fs-share", function(buffer){
        fileShare.buffer.push(buffer)
        fileShare.transmited += buffer.byteLength
        fileShare.progress_node.innerText = Math.trunc(fileShare.transmited/  fileShare.metadata.total_buffer_size *100) + "%"
        if(fileShare.transmited == fileShare.metadata.total_buffer_size){
            // download(new Blob(fileShare.buffer), fileShare.metadata.filename)
            downloadBlob(new Blob(fileShare.buffer), fileShare.metadata.filename);

                
        }
        else{
            socket.emit("fs-start",{
                uid: senderId
            })
        }
    })
})()