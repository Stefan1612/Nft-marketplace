# NFT-Marketplace Status/Issues/Ideas

## Status
- Work in progress
### To-do's
- Rewrite more detailed tests
- Rewrite the frontend to utilize events
- Allowance Bug inside contract
- Host website on netlify
- Rewrite frontend with MUI instead of Bootstrap

## Approach
Running on Mumbai/polygon
Nft Marketplace which allows you to trade, mint, sell, auction burn NFT's.
Using polygon's sidechain to reduce gas cost of all transactions mentioned above.
## Stack

### Blockchain Technologies
1. Environment - [Hardhat](https://hardhat.org/)
2. File Storage - [IPFS](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client#install)
3. Client - [ethers.js](https://docs.ethers.io/v5/)

### Frontend
- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)

## Backend
- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Fundamental Issues

## Ways to solve the problems

## Technical Issues

  
2. The front-end is a mess due to me not utilizing the solidity events. 
  Callback hell:
  - Hard to read
  - Hard to update
  - Inefficient

## Ways to solve the problems


2) I'll probaly redo the whole front-end utilizing the events and desgining with mui.

