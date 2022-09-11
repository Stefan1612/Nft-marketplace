const hre = require("hardhat");
const {
  storeContractAddress,
  verifyContract,
  printEtherscanLink,
} = require("./helper-functions");

const { ethers, network } = hre;

let DutchAuctionFactoryaddress = "";
let EngAuctionFactoryaddress = "";
let NftAddress = "";
let NFTMarketplaceAddress = "";

// Biconomy GOERLI forwarder address to enable native meta transactions

const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

async function deploy(contractName, args = []) {
  const { chainId } = network.config;

  const CF = await ethers.getContractFactory(contractName);
  const contract = await CF.deploy(...args);

  await contract.deployed();
  await storeContractAddress(contract, contractName);
  await verifyContract(contract, args);

  console.log("Deployer:", (await ethers.getSigners())[0].address);
  console.log(`${contractName} deployed to:`, contract.address);
  switch (contractName) {
    case "DutchAuctionFactory":
      DutchAuctionFactoryaddress = contract.address;
      break;

    case "EngAuctionFactory":
      EngAuctionFactoryaddress = contract.address;
      break;

    case "NftMarketPlace":
      NFTMarketplaceAddress = contract.address;
      break;

    case "NFT":
      NftAddress = contract.address;
      break;
    default:
      console.log("Wrong contract");
  }
  NftAddress = printEtherscanLink(contract.address, chainId);
}

async function main() {
  await deploy("DutchAuctionFactory");
  await deploy("EngAuctionFactory");
  await deploy("NftMarketPlace", [
    DutchAuctionFactoryaddress,
    EngAuctionFactoryaddress,
    forwarderAddress,
  ]);
  await deploy("NFT", [NFTMarketplaceAddress, forwarderAddress]);
  console.log(NftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
