
const hre = require("hardhat");

async function main() {

  const StorageMarketplace = await hre.ethers.deployContract("StorageMarketplace");

  await StorageMarketplace.waitForDeployment();

  console.log("Token address:", await StorageMarketplace.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
