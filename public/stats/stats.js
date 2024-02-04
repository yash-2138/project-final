import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
import { address, abi } from '../constants.js';


let signer = null;
let provider;
let contract;

const editCost = document.querySelector('#edit-button-cost')
const editCapacity = document.querySelector('#edit-button-capacity')
const editStauts = document.querySelector('#edit-button-status')

document.addEventListener('DOMContentLoaded', async ()=>{
    const addressText = document.querySelector('#address')
    const cost = document.querySelector('#cost')
    const capacity = document.querySelector('#capacity')
    const status = document.querySelector('#status')
    if(window.ethereum){
        try {
            provider = new ethers.BrowserProvider(window.ethereum)
            signer = await provider.getSigner();
            contract = new ethers.Contract(address, abi, signer);
            console.log("connected")

            const mySellOrder = await contract.getMysellOrder();
            addressText.innerHTML = mySellOrder[1]
            capacity.innerHTML = mySellOrder[2]
            cost.innerHTML = mySellOrder[3]
            if(mySellOrder[5] == 0){
                status.innerHTML = "Listed"
            }else if(mySellOrder[5] == 1){
                status.innerHTML = "Bought"
                editCapacity.style.display = 'none'
                editCost.style.display = 'none'
                editStauts.style.display = 'none'
            }
            else {
                status.innerHTML = "Canceled"
            }
        } catch (error) {
            if(error.reason === "Only storage owner can call this function"){
                document.querySelector('.table').style.display = 'none'
            }
            
        }
        
        
    }else{
        alert("Install Metamask!!")
    }
})

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

