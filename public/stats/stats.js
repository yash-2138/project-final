import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { address, abi } from '../constants.js';


let signer = null;
let provider;
let contract;

const editCost = document.querySelector('#edit-button-cost')
const editCapacity = document.querySelector('#edit-button-capacity')
const editStauts = document.querySelector('#edit-button-status')
const editStorageTable = document.querySelector('#editStorageTable')
const editTenure = document.querySelector('#edit-button-tenure')
const userType = document.querySelector('#userType')

const getFilesSO = ()=>{
    const filesTable = document.querySelector('#filesTableBody')
    fetch('/crud/getFilesSO',{
        method: "GET",
    })
    .then(response => response.json())
    .then(data=>{
        console.log(data)
        let cnt = 1;
        for(const file of data){
            const tr = document.createElement('tr')
            const th = document.createElement('th')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            th.innerHTML = cnt;
            td1.innerHTML = `<a href="/sender/?file=${file.fileName}">${file.fileName}</a>`
            
            if(file.request == 'active'){
                td2.innerHTML = `<b style="color: red;">Requested</b>`
            }
            else if(file.possession == 'SO'){
                td2.innerHTML = `With Me`
            }
            else{
                td2.innerHTML = "Returned"
            }

            tr.appendChild(th);
            tr.appendChild(td1);
            tr.appendChild(td2);
            filesTable.appendChild(tr);
            cnt++
        }

    })
    .catch(error => {
        console.error('Error fetching files:', error);
    });
        
}

const getStorageOverview = (forDO)=>{
    const storageRentedText = document.querySelector('#storage-rented')
    const usedSpaceText = document.querySelector('#used-space')
    const endDate = document.querySelector('#end-date')
    
    fetch('/crud/getStats',{
        method: "GET",
    })
        .then(response =>{
            if(response.ok){
                return response.json()
            }
            if(response.status == 404){
                const statsContainer = document.querySelector('#stats-overview-container')
                statsContainer.style.display= 'none'
                return
            }
            
        })
        .then(data=>{
            // console.log(data)
            if(forDO){
                const dailyCostData = document.querySelector('#daily-cost > div > div > h3')
                dailyCostData.innerHTML = `${data.price} ETH`
            }
            else{
                const monthlyRevenueData = document.querySelector('#monthly-revenue > div >div > h3')
                monthlyRevenueData.innerHTML = `${data.price} ETH`
            }
            
            endDate.innerHTML = formatDateString(data.endDate)
            storageRentedText.innerHTML = `${data.capacity / (1024 ** 3)} GB`
            const usedBytes = data.capacity - data.remainingCapacity

            
            if (usedBytes >= 1024 ** 3) {
                // Convert to GB if greater than or equal to 1 GB
                usedSpaceText.innerHTML = `${(usedBytes / (1024 ** 3)).toFixed(2)} GB`;
              } else if (usedBytes >= 1024 ** 2) {
                // Convert to MB if greater than or equal to 1 MB
                usedSpaceText.innerHTML = `${(usedBytes / (1024 ** 2)).toFixed(2)} MB`;
              } else if (usedBytes >= 1024) {
                // Convert to KB if greater than or equal to 1 KB
                usedSpaceText.innerHTML = `${(usedBytes / 1024).toFixed(2)} KB`;
              } else {
                // Display in bytes if less than 1 KB
                usedSpaceText.innerHTML = usedBytes.toFixed(2) + ' bytes';
            }                               
            
        })
        .catch(error =>{
            console.log(error)
        })
}


const getFilesDO = ()=>{
    const filesTable = document.querySelector('#filesTableBody')
    fetch('/crud/getFilesDO',{
        method: "GET",
    })
    .then(response => response.json())
    .then(data=>{
        // console.log(data)
        let cnt = 1;
        for(const file of data){
            const tr = document.createElement('tr')
            const th = document.createElement('th')
            const td1 = document.createElement('td')
            const td2 = document.createElement('td')

            th.innerHTML = cnt;
            td1.innerHTML = file.fileName

            if(file.possession == 'SO'){
                td2.innerHTML = `<button class="btn btn-stat" id=${file.id} style="color: white;">Request File</button>`
                
            }
            else{
                td2.innerHTML = "Received"
            }

            tr.appendChild(th);
            tr.appendChild(td1);
            tr.appendChild(td2);
            filesTable.appendChild(tr);
            cnt++

            if(file.possession == 'SO'){
                const requestBtn = document.getElementById(`${file.id}`)
                requestBtn.addEventListener('click',()=>{
                    fetch('/utils/fileRequest',{
                        method: 'POST',
                        headers:{ 'Content-Type': 'application/json'},
                        body: JSON.stringify({file: file.fileName})
                    })
                        .then(response => response.json())
                        .then(data =>{
                            if(data.msg == 'Success'){
                                alert("Request Send Successfully!!")
                                requestBtn.innerText = "Requested"
                            }
                            console.log(data)
                        })
                        .catch(error=>{
                            console.log(error)
                            alert("Error sending request: "+error)
                        })
                })
            }
            
            
            
        }

    })
    .catch(error => {
        console.error('Error fetching files:', error);
    });
}

if(userType.innerHTML === "SO"){
    document.addEventListener('DOMContentLoaded', async ()=>{
        const filesTableHead = document.querySelectorAll('#filesTable > thead > tr > th')
        filesTableHead[2].innerHTML = "Possession"
        const addressText = document.querySelector('#address')
        const cost = document.querySelector('#cost')
        const capacity = document.querySelector('#capacity')
        const status = document.querySelector('#status')
        const dailyCost = document.querySelector('#daily-cost')
        const tenure = document.querySelector('#tenure')
        dailyCost.style.display = 'none'
        if(window.ethereum){
            try {
                provider = new ethers.BrowserProvider(window.ethereum)
                signer = await provider.getSigner();
                contract = new ethers.Contract(address, abi, signer);
                console.log("connected")
    
                const mySellOrder = await contract.getMysellOrder();
                console.log(mySellOrder)
                addressText.innerHTML = mySellOrder[1]
                capacity.innerHTML = mySellOrder[2]
                cost.innerHTML = ethers.formatEther(mySellOrder[3])

                tenure.innerHTML = mySellOrder[5]
                
                if(mySellOrder[6] == 0){
                    status.innerHTML = "Listed"
                }else if(mySellOrder[6] == 1){
                    status.innerHTML = "Bought"
                    editStorageTable.style.display = 'none'
                    getStorageOverview(0)
                    getFilesSO()
                }
                else {
                    status.innerHTML = "Canceled"
                }
            } catch (error) {
                if(error.reason === "Only storage owner can call this function"){
                    editStorageTable.style.display = 'none'
                }    
            }
            
            
        }else{
            alert("Install Metamask!!")
        }
    })
    
}
else{
    editStorageTable.style.display = 'none'
    const monthlyRevenue = document.querySelector('#monthly-revenue')
    monthlyRevenue.style.display = 'none'
    if(window.ethereum){
        getStorageOverview(1)
        getFilesDO()
        
    }else{
        alert("Install Metamask!!")
    }
}



editCost.addEventListener('click', async()=>{
    const cost = document.querySelector('#cost')
    let newCost = prompt('Enter new Cost: ',cost.innerHTML)

    if(newCost){
        try {
            const result = await contract.editMySellOrderPrice(newCost);
            await result.wait();
            cost.innerHTML = newCost  
            console.log('Transaction successful:', result);
        } catch (error) {
            console.error('Transaction failed:', error.message);
            alert('Transaction failed. Please check the console for details.');
        }
       
    }
})

editCapacity.addEventListener('click', async ()=>{
    const capacity = document.querySelector('#capacity')
    let newcapacity = prompt('Enter new capacity: ',capacity.innerHTML)

    if(newcapacity){
        
        try {
            const result = await contract.editMySellOrderVolume(newcapacity);
            await result.wait();
            capacity.innerHTML = newcapacity 
            console.log('Transaction successful:', result);
        } catch (error) {
            console.error('Transaction failed:', error.message);
            alert('Transaction failed. Please check the console for details.');
        }
    }
})

editTenure.addEventListener('click', async ()=>{
    const tenure = document.querySelector('#tenure')
    let newTenure = prompt('Enter new Tenure: ',tenure.innerHTML)

    if(newTenure){
        try {
            const result = await contract.editMySellOrderTenure(newTenure);
            await result.wait();
            tenure.innerHTML = newTenure 
            console.log('Transaction successful:', result);
        } catch (error) {
            console.error('Transaction failed:', error.message);
            alert('Transaction failed. Please check the console for details.');
        }
    }
})

const statusDropdown = document.getElementById('statusDropdown');
editStauts.addEventListener('click',()=>{ 
    const statusElement = document.querySelector('#status')
    statusElement.style.display = 'none';
    statusDropdown.style.display = 'inline-block';
    statusDropdown.value = statusElement.innerHTML;
    statusDropdown.focus();
})
statusDropdown.addEventListener('change', async () => {
    const statusElement = document.querySelector('#status')
    if(statusDropdown.value === 'Canceled'){
        try {
            const result = await contract.cancelMySellOrder();
            await result.wait();
            console.log('Transaction successful:', result); 
        } catch (error) {
            console.error('Transaction failed:', error.message);
            alert('Transaction failed. Please check the console for details.');
        }
    }else if(statusDropdown.value === 'Listed'){
        try {
            const result = await contract.activateMySellOrder();
            await result.wait();
            console.log('Transaction successful:', result);
        } catch (error) {
            console.error('Transaction failed:', error.message);
            alert('Transaction failed. Please check the console for details.');
        }
    }
    statusElement.innerHTML = statusDropdown.value;
    statusDropdown.style.display = 'none';
    statusElement.style.display = 'inline-block';
});

function formatDateString(inputDateString) {
    let inputDate = new Date(inputDateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return inputDate.toLocaleDateString('en-US', options);
  }