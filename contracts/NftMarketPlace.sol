// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//random Number oracle
//import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// to get the transferFrom method
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// security against transactions for multiple requests

contract NftMarketPlace {
    uint256 listingPrice = 0.002 ether;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _tokensSold;

    function withdrawContractProfits() public {
        require(msg.sender == owner, "only the owner can call this function");
        payable(msg.sender).transfer(profits);
    }

    uint256 profits;

    address owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // Market Token that gets minted everytime someone mints on our market
    struct MarketToken {
        address nftContractAddress;
        uint256 tokenId;
        uint256 price;
        bool onSale;
        address payable owner;
        address payable seller;
        address minter;
    }

    mapping(uint256 => MarketToken) idToMarketToken;

    //modifer to get the exact listing price
    modifier paidListingPrice() {
        require(msg.value == listingPrice, "You need to pay the listingPrice");
        _;
    }

    // creates marketToken and mints nft at given address(_nftContractAddress), transfers
    function mintMarketToken(address _nftContractAddress)
        public
        payable
        paidListingPrice
    {
        _tokenIds.increment();
        uint256 currentTokenID = _tokenIds.current();

        idToMarketToken[currentTokenID] = MarketToken(
            _nftContractAddress,
            currentTokenID,
            0,
            false,
            payable(msg.sender),
            payable(address(0)),
            msg.sender
        );

        profits += msg.value;
    }

    function saleMarketToken(
        uint256 _tokenId,
        uint256 sellPrice,
        address _nftContractAddress
    ) public {
        require(sellPrice > 0, "Price must be atleast one wei");
        /*uint256 currentTokenID = _tokenIds.current();
        require(_tokenId <= currentTokenID, "non valid TokenID");
        _tokenIds.increment();*/
        require(
            idToMarketToken[_tokenId].onSale == false,
            "The token is already on sale"
        );
        //testbegin
        require(
            idToMarketToken[_tokenId].owner == msg.sender,
            "only owner of token can call this method"
        );

        IERC721(_nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        idToMarketToken[_tokenId].price = sellPrice;
        idToMarketToken[_tokenId].onSale = true;
        idToMarketToken[_tokenId].seller = payable(msg.sender);
    }

    function buyMarketToken(uint256 _tokenId, address _nftContractAddress)
        public
        payable
    {
        require(
            msg.value == idToMarketToken[_tokenId].price,
            "Message value must be equal to sellPrice"
        );
        require(
            idToMarketToken[_tokenId].onSale == true,
            "NFT must be up for sale"
        );
        require(
            msg.sender != idToMarketToken[_tokenId].owner,
            "You cannot buy of yourself (atleast not with the same address"
        );

        /*if (fetchTokensMintedByCaller().length == 0) {
            IERC721(_nftContractAddress).setApprovalForAll(address(this), true);
        }*/

        IERC721(_nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        payable(idToMarketToken[_tokenId].seller).transfer(msg.value);

        idToMarketToken[_tokenId].price = 0;
        idToMarketToken[_tokenId].onSale = false;
        idToMarketToken[_tokenId].owner = payable(msg.sender);
    }

    function fetchAllTokensOnSale() public view returns (MarketToken[] memory) {
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 tokensOnSale;

        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                tokensOnSale += 1;
            }
        }
        MarketToken[] memory res = new MarketToken[](tokensOnSale);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    function deleteNFT(uint256 _tokenId) public returns (bool) {
        require(
            msg.sender == idToMarketToken[_tokenId].owner,
            "only the owner of the nft can delete it"
        );
        uint256 currentLastTokenId = _tokenIds.current();
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].tokenId == _tokenId) {
                idToMarketToken[i] = MarketToken(
                    address(0),
                    0,
                    0,
                    false,
                    payable(address(0)),
                    payable(address(0)),
                    address(0)
                );
            }
        }
        return true;
    }

    function fetchAllMyTokens() public view returns (MarketToken[] memory) {
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 yourTokenCount;

        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == msg.sender) {
                yourTokenCount += 1;
            }
        }
        MarketToken[] memory res = new MarketToken[](yourTokenCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == msg.sender) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    function fetchTokensMintedByCaller()
        public
        view
        returns (MarketToken[] memory)
    {
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 yourMintedTokens;

        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == msg.sender) {
                yourMintedTokens += 1;
            }
        }
        MarketToken[] memory res = new MarketToken[](yourMintedTokens);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == msg.sender) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    function fetchAllTokens() public view returns (MarketToken[] memory) {
        uint256 currentLastTokenId = _tokenIds.current();

        MarketToken[] memory res = new MarketToken[](currentLastTokenId);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            res[count] = idToMarketToken[i];
            count += 1;
        }
        return res;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
}
