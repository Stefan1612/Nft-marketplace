const { expect /* , assert */ } = require("chai");
const { ethers } = require("hardhat");
/* const { utils, BigNumber } = require("ethers"); */

const toWei = (num) => ethers.utils.parseEther(num.toString());
/* const fromWei = (num) => ethers.utils.formatEther(num); */

describe("NftMarketPlace", function () {
  let market;
  let nft;
  let nftContractAddress;
  let marketAddress;
  let dutchAuctionFactory;
  let dutchAuctionFactoryaddress;
  let englishAuctionFactory;
  let englishAuctionFactoryaddress;
  const forwarderAddress = "0xE041608922d06a4F26C0d4c27d8bCD01daf1f792";

  beforeEach(async () => {
    const DutchAuctionFactory = await ethers.getContractFactory(
      "DutchAuctionFactory"
    );
    dutchAuctionFactory = await DutchAuctionFactory.deploy();
    await dutchAuctionFactory.deployed();
    dutchAuctionFactoryaddress = dutchAuctionFactory.address;

    const EnglishAuctionFactory = await ethers.getContractFactory(
      "EngAuctionFactory"
    );
    englishAuctionFactory = await EnglishAuctionFactory.deploy();
    await englishAuctionFactory.deployed();
    englishAuctionFactoryaddress = englishAuctionFactory.address;

    const Market = await ethers.getContractFactory("NftMarketPlace");
    market = await Market.deploy(
      dutchAuctionFactoryaddress,
      englishAuctionFactoryaddress,
      forwarderAddress
    );
    await market.deployed();
    marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(marketAddress, forwarderAddress);
    await nft.deployed();
    nftContractAddress = nft.address;
  });
});
