require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    development: {
      url:process.env.PROVIDER_URL, // Ganache default URL
      accounts:[process.env.PRIVATE_KEY]
    },
  },
  solidity: "0.8.20",
};
