// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// @notice Counter Library to keep track of TokenID
import "@openzeppelin/contracts/utils/Counters.sol";

// @notice debugging tool
import "hardhat/console.sol";

// @dev to get the transferFrom method
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// @notice security
// @dev security against transactions with multiple requests
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


// @notice Marketplace contract
contract NftMarketPlace is ReentrancyGuard{

    // @notice fee to list a NFT on the marketplace
    uint256 constant public listingPrice = 0.002 ether;

    // @notice enabling counter
    // @dev making use of counter library for Counters.Counter
    using Counters for Counters.Counter;

    // @notice keeping track of tokenID 
    Counters.Counter private _tokenIds;
   
    // @notice Market Token that gets minted every time someone mints on our market
    // @dev struct representing our MarketToken and its values at any given time
    struct MarketToken {
        address nftContractAddress;
        uint256 tokenId;
        uint256 price;
        bool onSale;
        address payable owner;
        address payable seller;
        address minter;
    }

    // @notice indexing from ID to the associated market Token
    // @dev mapping from ID to associated market Token
    mapping(uint256 => MarketToken) public idToMarketToken;

    // @notice profits of the contract from "listingPrice" fees
    uint256 private profits;

    // @notice contract deployer
    address immutable public owner;

    // @notice setting owner to contract deployer
    constructor() {
        owner = payable(msg.sender);
    }

    // @notice signal used to update the website in real time after mint
    // @dev event to update front-end after market Item creating
    event marketItemCreated(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        uint256 price,
        bool onSale,
        address indexed owner,
        address seller,
        address minter
    );
    // @notice signal used to update the website in real time after putting item on sale
    event marketItemOnSale(
        address indexed nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller,
        address minter
    );
    // @notice signal used to update the website in real time after item has been bought
    event marketItemBought(
        address indexed nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller,
        address minter
    );

    // @notice checking if correct listing price has been paid
    // @dev modifer to get the exact listing price
    modifier paidListingPrice() {
        require(msg.value == listingPrice, "You need to pay the listingPrice");
        _;
    }

    // @notice checking if caller is owner
    function withdrawContractProfits() public {
        require(msg.sender == owner, "only the owner can call this function");
        payable(msg.sender).transfer(profits);
    }

    // @notice mint NFT
    // @dev creates marketToken and mints nft at given address(_nftContractAddress), transfers
    // @param address of NFT contract
    function mintMarketToken(address _nftContractAddress)
        external
        payable
        paidListingPrice
    {   
        // @dev incrementing ID
        _tokenIds.increment();
        uint256 currentTokenID = _tokenIds.current();

        // @dev create not MarketToken with current ID and save inside mapping
        idToMarketToken[currentTokenID] = MarketToken(
            _nftContractAddress,
            currentTokenID,
            0,
            false,
            payable(msg.sender),
            payable(address(0)),
            msg.sender
        );

        // @dev adding listing price to contract profits
        profits += msg.value;
        emit marketItemCreated(_nftContractAddress, currentTokenID, 0, false, msg.sender,address(0),msg.sender);
    }

    // @notice sell NFT
    // @dev putting market Token for sale on marketplace
    // @param token 
    /* Id of NFT putting up for sale, 
       the price you want the NFT to be sold for,
       the contract address of the NFT you want to sell 
    */
    function saleMarketToken(
        uint256 _tokenId,
        uint256 sellPrice,
        address _nftContractAddress
    ) external {
        // @dev sell price must be > 0 Wei
        require(sellPrice > 0, "Price must be atleast one wei");
        // @dev token can't be on sale already
        require(
            idToMarketToken[_tokenId].onSale == false,
            "The token is already on sale"
        );
        // @dev seller must be owner
        require(
            idToMarketToken[_tokenId].owner == msg.sender,
            "only owner of token can call this method"
        );
        // @dev transferring the NFT created in given contract address from current caller to this marketplace
        IERC721(_nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        // @dev updating state of for sale listed NFT
        idToMarketToken[_tokenId].price = sellPrice;
        idToMarketToken[_tokenId].onSale = true;
        idToMarketToken[_tokenId].seller = payable(msg.sender);
    }

    // @notice buy NFT
    // @dev buy market Token which is currently up for sale
    // @param
    /* token ID of market Token chosen to be bought,
       contract address of NFT chosen to be bought
    */ 
    function buyMarketToken(uint256 _tokenId, address _nftContractAddress)
        external
        payable nonReentrant 
    {   
        // @dev require existing ID
        require(_tokenId > 0, "TokenId must be over 0");
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
            "You cannot buy from yourself (atleast not with the same address)"
        );

       
        // @dev transaferring NFT created in given address from this marketplace to the msg.sender (buyer)
        IERC721(_nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        // @dev transferring the eth from contract (provided by buyer) to the seller of the nft
        payable(idToMarketToken[_tokenId].seller).transfer(msg.value);

        // @dev update the state of bought market Token
        idToMarketToken[_tokenId].price = 0;
        idToMarketToken[_tokenId].onSale = false;
        idToMarketToken[_tokenId].owner = payable(msg.sender);
    }

    // @notice getting all tokens which are currently up for sale
    // @returns array of Market Tokens currently up for sale
    function fetchAllTokensOnSale() external view returns (MarketToken[] memory) {

        // @dev saving current ID to save some gas
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 tokensOnSale;
        // @dev loop to get the number of tokens on sale
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                tokensOnSale += 1;
            }
        }
        // @dev creating a memory array with the length of num "of tokens on sale"
        MarketToken[] memory res = new MarketToken[](tokensOnSale);
        uint256 count = 0;
        // @dev updating the memory array with all market tokens with onSale == true
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    /*function deleteNFT(uint256 _tokenId) external returns (bool) {
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
    }*/
    // @notice getting all tokens which currently belong to msg.sender
    // @returns array of Market Tokens which currently belong to msg.sender
    function fetchAllMyTokens() external view returns (MarketToken[] memory) {
        // @dev saving current ID to save some gas
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 yourTokenCount;
        // @dev loop to get the number of tokens currently belonging to msg.sender
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == msg.sender) {
                yourTokenCount += 1;
            }
        }
        // @dev creating a memory array with the length of num "of tokens belonging to msg.sender"
        MarketToken[] memory res = new MarketToken[](yourTokenCount);
        uint256 count = 0;
        // @dev updating the memory array with all market tokens with onSale == true
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == msg.sender) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }
    // @notice getting all tokens which got minted by the caller
    // @returns array of Market Tokens which got minted by the caller
    function fetchTokensMintedByCaller()
        external
        view
        returns (MarketToken[] memory)
    {   
        // @dev saving current ID to save some gas
        uint256 currentLastTokenId = _tokenIds.current();

        uint256 yourMintedTokens;
        // @dev loop to get the number of tokens minted by caller
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == msg.sender) {
                yourMintedTokens += 1;
            }
        }
        // @dev creating a memory array with the length of num "minted by caller"
        MarketToken[] memory res = new MarketToken[](yourMintedTokens);
        uint256 count = 0;
        // @dev updating the memory array with all market tokens which are minted by the caller
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == msg.sender) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }
    // @notice returns all market tokens
    // @returns array of all market tokens
    function fetchAllTokens() external view returns (MarketToken[] memory) {
        uint256 currentLastTokenId = _tokenIds.current();

        MarketToken[] memory res = new MarketToken[](currentLastTokenId);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            res[count] = idToMarketToken[i];
            count += 1;
        }
        return res;
    }

    // @returns listing price
    function getListingPrice() external view returns(uint){
        return listingPrice;
    }
}