import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { address, abi } from '../constants.js';


let signer = null;
let provider;
let contract;



document.addEventListener('DOMContentLoaded',async() =>{
  if(window.ethereum){
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    contract = new ethers.Contract(address, abi, signer);
    console.log("connected")

    const sellOrderAddresses = await contract.getAllSellOrders();
    // console.log(sellOrderAddresses);
    const sellOrderListElement = document.querySelector('#storage-order-list')
    
  
    for (const orderAddress of sellOrderAddresses) {
      
      const [email,storageOwner, volumeGB, price, securityDeposit, tenureDays, state] = await contract.getStorageSellOrderDetails(orderAddress);

      if(state == 0){
        // console.log(orderAddress)
        let newRow = sellOrderListElement.insertRow(sellOrderListElement.rows.length);
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);
        let cell6 = newRow.insertCell(5);
        cell1.innerHTML = email;
        cell2.innerHTML = storageOwner;
        cell3.innerHTML = `${volumeGB} <span>GB</span>`;
        cell4.innerHTML = `${ethers.formatEther(price)} <span>ETH</span>`;
        cell5.innerHTML = tenureDays
        cell6.innerHTML = `<button class="btn btn-primary buy-btn" id=${storageOwner}>Buy</button>`;
    
        const finalPrice = ethers.formatEther(price) * tenureDays.toString()
        const currentDate = new Date();
        const currentFormatedDate =  formatDate(currentDate)
        const endDate = formatDate(addDaysToDate(currentDate, parseInt(tenureDays.toString(), 10)))
        const timestamp = Date.now();
        // console.log(timestamp);
        const enddateTimestamp = new Date(timestamp)
        enddateTimestamp.setDate(enddateTimestamp.getDate() + Number(tenureDays));
          
        
        
        const buyBtn = document.getElementById(`${storageOwner}`)
        buyBtn.addEventListener('click', async()=>{
          try {
            const tx = await contract.buyStorage(storageOwner,email ,{
              value: ethers.parseEther(finalPrice.toString())
            })
            console.log("Transaction Sent. Waiting for Confirmation...")
  
            await tx.wait();
            console.log("Transaction Confirmed");

            const requestData = {
              // user_id: 2, //remove this
              email: email,
              sellOrderAddress: storageOwner,
              contractAddress:signerAddress, 
              capacity:volumeGB,
              startDate: currentFormatedDate,
              endDate: endDate,
              price: ethers.formatEther(price),
              enddateTimestamp: Date.parse(enddateTimestamp)/1000
            }
            const replacer = (key, value) => {
              if (typeof value === 'bigint') {
                  return value.toString();
              }
              return value;
            };
            fetch('/crud/addStorage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData,replacer),
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Success:', data);
              })
            
            alert("Storage bought successfully!")
            location.assign("/stats")
          } catch (error) {
            console.error("Error during transaction:", error);
            alert("Error during transaction. Please check the console for details.");
          }
        });
      }
      

    }

  }else{
      alert("Install Metamask!!")
  }
})



function addDaysToDate(currentDate, daysToAdd) {
  let newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
}

function formatDate(date) {
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  let day = date.getDate().toString().padStart(2, '0');
  return year + '-' + month + '-' + day;
}


  


