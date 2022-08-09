// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
 
import "./EngAuction.sol";


contract auctionFactory{

    EngAuction[] public EngAuctionAddresses; 


    function createEngAuction(address _nft,
        uint _nftId,
        uint _startingBid) external {
        EngAuction engAuction = new EngAuction( _nft,
         _nftId,
       _startingBid);
        EngAuctionAddresses.push(engAuction);
    }


}