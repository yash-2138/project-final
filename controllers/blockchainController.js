const {ethers} = require('ethers')
const {address, abi} = require('../constants.js')
const dbClient = require("../db.js")
require('dotenv').config();


const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL)
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
const scheduleContractCompletetion =async ()=> {
    // const signer = await provider.getSigner();
    const contract = new ethers.Contract(address,abi,  wallet)

    const date = Date.now()/1000
    dbClient.query(
        'SELECT id, enddateTimestamp, contractAddress from myStorage where active = 1',
        [],
        async (error, results)=>{
            if(error){
                
            }
            if(results){
                for(let storage of results){         
                    if(date > storage.enddateTimestamp){
                        try {
                            console.log(date)
                            console.log(storage.enddateTimestamp)
                            const tx = await contract.completeRentalContract(storage.contractAddress)
                            await tx.wait();
                            dbClient.query(
                                'UPDATE myStorage SET active = 0 WHERE id = ?',
                                [storage.id],
                                (updateError, updateResult) => {
                                    if(updateError){
    
                                    }
                                }
                            )
                                 
                        } catch (error) {
                            if (error.code === 'CALL_EXCEPTION' && error.reason === 'endTime not achived') {
                                console.log('Revert reason:', error.reason);
                            } else {
                                console.error('Error:', error);
                            }
                        }
                        
                    }else{
                        console.log('time not achieved')
                    }
                }
            }
        }    
    )
}

// setInterval(scheduleContractCompletetion, 60000)
setInterval(scheduleContractCompletetion, 86400000)

