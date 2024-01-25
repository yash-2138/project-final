import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { address, abi } from '../constants.js';


let signer = null;
let provider;
let contract;



document.addEventListener('DOMContentLoaded',async() =>{
  if(window.ethereum){
    provider = new ethers.BrowserProvider(window.ethereum)
    signer = await provider.getSigner();
    contract = new ethers.Contract(address, abi, signer);
    console.log("connected")

    const sellOrderAddresses = await contract.getAllSellOrders();
    console.log(sellOrderAddresses);
    const sellOrderListElement = document.querySelector('#storage-order-list')
    
    
    for (const orderAddress of sellOrderAddresses) {
      const [email,storageOwner, volumeGB, price, securityDeposit, isAvailable] = await contract.getStorageSellOrderDetails(orderAddress);
      if(isAvailable){
        let newRow = sellOrderListElement.insertRow(sellOrderListElement.rows.length);
        let cell1 = newRow.insertCell(0);
        let cell2 = newRow.insertCell(1);
        let cell3 = newRow.insertCell(2);
        let cell4 = newRow.insertCell(3);
        let cell5 = newRow.insertCell(4);
        let cell6 = newRow.insertCell(5);
        cell1.innerHTML = email;
        cell2.innerHTML = storageOwner;
        cell3.innerHTML = volumeGB;
        cell4.innerHTML = price;
        cell5.innerHTML = isAvailable
        cell6.innerHTML = `<button class="btn btn-primary buy-btn" id=${storageOwner}>Buy</button>`;

        const buyBtn = document.getElementById(`${storageOwner}`)
        buyBtn.addEventListener('click', async()=>{
          console.log("j")
          const tx = await contract.buyStorage(storageOwner,email, "5" ,{
            value: ethers.parseEther(price.toString())
          })
          console.log("Transaction Sent. Waiting for Confirmation...")

          await tx.wait();
          console.log("Transaction Confirmed");
          alert("Storage bought successfully!")
        });
      }
      

    }

  }else{
      alert("Install Metamask!!")
  }
})






  


