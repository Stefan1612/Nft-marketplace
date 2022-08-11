
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

// CONTRACTS
/// @title DutchAuction
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Auction contract to create Dutch auctions for NFT's inside the NFT marketplace
/* The auction is 7 days long by default and during this seven days users are able to bid for the NFT. After
the seven days the highest bid gains ownership of the NFT*/ 

contract EngAuction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    IERC721 public immutable i_nft;
    uint public immutable i_nftId;

    address payable public immutable i_seller;
    uint public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(
        address _nft,
        uint _nftId,
        uint _startingBid
    ) {
        i_nft = IERC721(_nft);
        i_nftId = _nftId;

        i_seller = payable(tx.origin);
        highestBid = _startingBid;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == i_seller, "not seller");

        i_nft.transferFrom(msg.sender, address(this), i_nftId);
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    function bid() external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
        require(msg.value > highestBid, "value < highest");

        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        payable(msg.sender).transfer(bal);

        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            i_nft.safeTransferFrom(address(this), highestBidder, i_nftId);
            i_seller.transfer(highestBid);
        } else {
            i_nft.safeTransferFrom(address(this), i_seller, i_nftId);
        }

        emit End(highestBidder, highestBid);
    }
}