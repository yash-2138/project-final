const {ethers} = require('ethers')
const {address, abi} = require('../constants.js')
require('dotenv').config();


const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL)

const contract = new ethers.Contract(address,abi,  provider)

