// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
 
import "../DutchAuction.sol";


contract DutchAuctionFactory{

    DutchAuction[] public DutchAuctionAddresses; 
    
    function createDutchAuction(uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId) external {
        DutchAuction dutchAuction = new DutchAuction(_startingPrice,
        _discountRate,
         _nft,
         _nftId);
        DutchAuctionAddresses.push(dutchAuction);
    }

    function returnAllDutchAuctions() public view returns(DutchAuction[] memory){
        return DutchAuctionAddresses;
    }
}