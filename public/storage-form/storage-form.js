
import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { address, abi } from '../constants.js';
const addStorage = document.querySelector("#submit-storage-form");

let provider
let signer
let contract

document.addEventListener('DOMContentLoaded',async ()=>{
    if(window.ethereum){
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner();
        contract = new ethers.Contract(address, abi, signer);
        console.log("connected")
        
    }else{
        alert("Install Metamask!!")
    }
})

addStorage.addEventListener('click', async (event)=>{
    event.preventDefault(); 
    const email = document.querySelector('#userEmail').innerHTML
    const tenure = document.querySelector("#tenure").value
    const capacity = document.querySelector("#capacity").value
    const price = document.querySelector("#price").value
    console.log(email, tenure, capacity, price)
    const securityDeposit = '0.00001';
    try {
    const tx = await contract.createStorageSellOrder(email, capacity, ethers.parseEther(price),ethers.parseEther(securityDeposit), tenure ,{
        value: ethers.parseEther(securityDeposit)
    });
    await tx.wait();
    console.log('created')
    alert("Storage Sell Order created successfully!");
    location.assign("/marketplace")
    } catch (error) {
        console.error("Error creating Storage Sell Order:", error.message);
        
    }


})