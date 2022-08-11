// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

// CONTRACTS
/// @title DutchAuction
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Auction contract to create Dutch auctions for NFT's inside the NFT marketplace
/* The auction is 7 days long by default and the price of the NFT continiusly declines by a percentange during this duration.
Starting at a user selected starting price and a user selected discount rate*/ 

contract DutchAuction {

    /// @notice duration of auction 
    uint private constant DURATION = 7 days;


    IERC721 public immutable i_nft;
    uint public immutable i_nftId;
    address payable public immutable i_seller;
    uint public immutable i_startingPrice;
    uint public immutable i_startAt;
    uint public immutable i_expiresAt;
    uint public immutable i_discountRate;

    constructor(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) {
        i_seller = payable(tx.origin);
        i_startingPrice = _startingPrice;
        i_startAt = block.timestamp;
        i_expiresAt = block.timestamp + DURATION;
        i_discountRate = _discountRate;

        require(_startingPrice >= _discountRate * DURATION, "starting price < min");

        i_nft = IERC721(_nft);
        i_nftId = _nftId;
    }

    function getPrice() public view returns (uint) {
        uint timeElapsed = block.timestamp - i_startAt;
        uint discount = i_discountRate * timeElapsed;
        return i_startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < i_expiresAt, "auction expired");

        uint price = getPrice();
        require(msg.value >= price, "ETH < price");

        i_nft.transferFrom(i_seller, msg.sender, i_nftId);
        uint refund = msg.value - price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        selfdestruct(i_seller);
    }
}