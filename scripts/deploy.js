/* const hre = require("hardhat");
const fs = require("fs")

async function main() {
  
  
  const NFTMarket = await hre.ethers.getContractFactory("NftMarketPlace");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log("nftMarket contract deployed to: ", nftMarket.address);

  

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);

  await nft.deployed();

  console.log("NftFactory deployed to:", nft.address);


  let config = `
  export const nftmarketaddress = "${nftMarket.address}"
  export const nftaddress = "${nft.address}"`

  let data = JSON.stringify(config)
  fs.writeFileSync("config.js", JSON.parse(data))

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); */

const hre = require("hardhat");
const {
  storeContractAddress,
  verifyContract,
  printEtherscanLink,
} = require("./helper-functions");

const { ethers, network } = hre;
let NftAddress = "";
async function deploy(contractName, args = []) {
  const { chainId } = network.config;

  const CF = await ethers.getContractFactory(contractName);
  const contract = await CF.deploy(...args);

  await contract.deployed();
  await storeContractAddress(contract, contractName);
  await verifyContract(contract, args);

  console.log("Deployer:", (await ethers.getSigners())[0].address);
  console.log(`${contractName} deployed to:`, contract.address);
  NftAddress = contract.address;
  printEtherscanLink(contract.address, chainId);
}

async function main() {
  await deploy("NftMarketPlace");
  await deploy("NFT", [NftAddress]);
  console.log(NftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
