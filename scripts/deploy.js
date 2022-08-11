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
  ]);
  await deploy("NFT", [NFTMarketplaceAddress]);
  console.log(NftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
