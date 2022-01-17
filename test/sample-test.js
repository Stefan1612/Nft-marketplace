const { expect, assert } = require("chai");
const {ethers} = require("hardhat");
const {utils, BigNumber} = require('ethers');

describe("NftMarketPlace", function () {
  it("Should Mint and trade NFTs", async function () {  

  //test to receive contract addresses
  const Market = await ethers.getContractFactory("NftMarketPlace")
  const market = await Market.deploy()
  await market.deployed()
  const marketAddress = market.address

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress)
  await nft.deployed()
  const nftContractAddress = nft.address
  
  
  //test to receive listing price and auction price
  let listingPrice = await market.getListingPrice()
  listingPrice = listingPrice.toString()

  const auctionPrice = ethers.utils.parseUnits("100", "ether")

  //test for minting
  await nft.createNFT("https-1")
  
  await nft.createNFT("https-2")

  await nft.createNFT("https-3")

  //need to work on those tests
  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })

  
  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })

  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })
  
  let own = await nft.ownerOf(1)
  console.log(own)

  

  await market.saleMarketToken(1, 200, nftContractAddress)
  await market.saleMarketToken(2, 200, nftContractAddress)
  await market.saleMarketToken(3, 200, nftContractAddress)
  own = await nft.ownerOf(1)
  console.log(own)
  

  await expect(market.saleMarketToken(3, 200, nftContractAddress)).to.be.revertedWith(
    "The token is already on sale"
  )
  
  await expect(market.buyMarketToken(1, nftContractAddress,  {
    value: 200
  })).to.be.revertedWith("You cannot buy of yourself (atleast not with the same address")

  // problem im code below
  const [owner, addr1, addr2] = await ethers.getSigners()

  
  

  await market.connect(addr2).buyMarketToken(1, nftContractAddress, {
    value: 200
  })

  

  await market.connect(addr1).buyMarketToken(3, nftContractAddress, {
    value: 200
  })

  await expect(market.saleMarketToken(2, 300, nftContractAddress)).to.be.revertedWith('The token is already on sale');
  await expect(market.connect(addr2).saleMarketToken(3, 300, nftContractAddress)).to.be.revertedWith('only owner of token can call this method');

  
  let approved = await nft.isApprovedForAll(addr2.address, marketAddress)
  console.log(approved)
  approved = await nft.isApprovedForAll(owner.address, marketAddress)
  console.log(approved)
  own = await nft.ownerOf(1)
  console.log(own)
  console.log(addr2.address)

  data = await market.connect(addr2).fetchTokensMintedByCaller()
  console.log(data.length)


 
  data = await market.connect(addr1).fetchAllMyTokens()
  console.log(data)
  // ERC721 not realizing that new owner of token
  /*await market.connect(addr2).saleMarketToken(1, 420, nftContractAddress)

  await expect(market.buyMarketToken(1,nftContractAddress ,{
    value: 420
  })).to.be.revertedWith("ERC721: transfer of token that is not own")
 
*/

 
  });
});

describe("NftMarketPlace", function () {
  it("testing the delete function", async function () {  

     //test to receive contract addresses
  const Market = await ethers.getContractFactory("NftMarketPlace")
  const market = await Market.deploy()
  await market.deployed()
  const marketAddress = market.address

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress)
  await nft.deployed()
  const nftContractAddress = nft.address


     //test for minting
  await nft.createNFT("https-1")
  
  await nft.createNFT("https-2")

  await nft.createNFT("https-3")


    //test to receive listing price and auction price
  let listingPrice = await market.getListingPrice()
  listingPrice = listingPrice.toString()

  //need to work on those tests
  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })

  
  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })

  await market.mintMarketToken(nftContractAddress, {
    value: listingPrice
  })
  
  
  await market.saleMarketToken(2, 200, nftContractAddress)


  // problem im code below
  const [owner, addr1, addr2] = await ethers.getSigners()

  await market.deleteNFT(1)
  })})
