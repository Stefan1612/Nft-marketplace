# NFT-Marketplace Status/Issues/Ideas

## Status
- Work in progress
### To-do's
- Host website on netlify

## Approach
Running on Mumbai/polygon
A NFT Marketplace running currently on Rinkeby. Let's you mint, sell and buy NFT's. During the minting we store the Metadata on IPFS and only store the TokenURI on-chain.
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

