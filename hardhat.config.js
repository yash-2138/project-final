require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    development: {
      url:process.env.PROVIDER_URL, // Ganache default URL
      accounts:[process.env.PRIVATE_KEY]
    },
    sepolia:{
      url: process.env.SEPOLIA_URL,
      accounts:[process.env.SEPOLIA_PRIVATE_KEY],
      chainId: 11155111
    }
  },
  solidity: "0.8.20",
};
