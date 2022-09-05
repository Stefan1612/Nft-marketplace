# NFT-Marketplace

## Status

The NFT Marketplace is currently running and fully functional on Rinkeby at

1. NFT Market:

2. NFT:

The Website is online and running at [Website](https://velvety-quokka-fa8702.netlify.app/)

## Video Demo

## Approach

Running currently on Rinkeby
A NFT Marketplace running currently on Rinkeby. Let's you mint, sell and buy NFT's. During the minting we store the Metadata on IPFS and only store the TokenURI on-chain.

## Stack

### Blockchain Technologies

1. Environment - [Hardhat](https://hardhat.org/)
2. File Storage - [IPFS](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#install)
3. Client - [ethers.js](https://docs.ethers.io/v5/)

## Biconomy

### Demo videos:

NFT Marketplace: hhttps://www.youtube.com/watch?v=zYdKS_B3RJo

SKD Hyphen: https://www.youtube.com/watch?v=cViRhJu1qIM

### Hyphen Widget

The Biconomy Hyphen Widget allows for fast and easy cross chain movement of funds. You can easily with a few clicks and seconds transfer your
Tokens from one network to another

Biconomy docs: https://docs.biconomy.io/products/hyphen-instant-cross-chain-transfers/hyphen-widget

Added at: [Code]()

### Gasless Transactions

This NFT allows party gasless NFT minting,selling and buying (mintNFT(), sellNFT(), buyNFT()) thanks to biconomy (only the marketplace itself and not NFT contract is currently gasless, because of the nature of my contract setup only the second transaction you need to accept for minting, etc... will be gasless (you still have to pay 0.002 eth fee to the contract to the owner when minting))

Biconomy docs: https://docs.biconomy.io/products/enable-gasless-transactions/choose-an-approach-to-enable-gasless/eip-2771

Added at: [Code]()

And all contracts modified accordingly: [Code]()

### Frontend

- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)
- [Bootstrap]

## Backend

- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Challenges

- Handling Allowance
- IPFS upload
