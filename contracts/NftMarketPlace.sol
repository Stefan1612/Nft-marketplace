// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// IMPORTS ------------------------------------------------------------------------------------
/// @notice debugging tool
import "hardhat/console.sol";
/// @dev to interact the transferFrom method
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
/// @dev security against transactions with multiple requests
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/// @dev Biconomy gasless transactions
import "./Gasless/ERC2771Recipient.sol";



// INTERFACES ----------------------------------------------------------------------------

interface IDutchAuctionFactory {
    function createDutchAuction(uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId) external;
}

interface IEngAuctionFactory {
    function createEngAuction(address _nft,
        uint _nftId,
        uint _startingBid) external;
}

// LIBRARIES ------------------------------------------------------------------------------------
/// @notice Counter Library to keep track of TokenID
import "@openzeppelin/contracts/utils/Counters.sol";

// ERROR MESSAGES ------------------------------------------------------------------
error NftMarketPlace__NotOwnerOfToken(address sender, uint tokenId);
error NftMarketPlace__invalidSellPrice(address sender, uint valueSend);
error NftMarketPlace__TokenAlreadyOnSale(uint tokenId );
error NftMarketPlace__DidNotPayLISTINGPRICE(uint value);
error NftMarketPlace__NotOwnerOfContract(address requester);
error NftMarketPlace__TokenIdUnderOne(uint tokenId);
error NftMarketPlace__TokenNotOnSale(uint tokenId);
error NftMarketPlace__UnequalToSellPrice(uint valueSend);
error NftMarketPlace__CallerIsOwnerOfToken(address caller, uint tokenId);

// CONTRACTS ------------------------------------------------------------------------------------
/// @title NFT Marketplace 
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Contract used to allow trading, selling, creating Market Items (NFT)
/// @dev Please NOTE: I've added custom error messages in this version due to gas efficiency BUT because of the unconvential 
// syntax I have also added the require statements in the comments for a less gas efficient but more readable alternative.
contract NftMarketPlace is ReentrancyGuard, ERC2771Recipient{


    // -----------------------------------
    // Enable Biconomy gasless Tx
    // -----------------------------------

    function _msgSender() internal override ( ERC2771Recipient) view returns (address) {
        return ERC2771Recipient._msgSender();
    }

    
    function _msgData() internal override ( ERC2771Recipient) view returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -----------------------------------
    // Type declarations, State Variables
    // -----------------------------------
 
    /// @dev making use of counter library for Counters.Counter
    using Counters for Counters.Counter;

    /// @notice keeping track of tokenID 
    Counters.Counter private s_tokenIds;

    /// @notice fee to list a NFT on the marketplace
    uint256 constant public LISTINGPRICE = 0.002 ether;


    /// @notice Market Token that gets minted every time someone mints on our market
    /// @dev struct representing our MarketToken and its values at any given time
    struct MarketToken {
        address nftContractAddress;
        uint256 tokenId;
        uint256 price;
        // saving onSale and owner inside one 1 storage slot.
        bool onSale;
        address payable owner;
        address payable seller;
        address minter;
    }

    /// @notice indexing from ID to the associated market Token
    mapping(uint256 => MarketToken) public idToMarketToken;

    /// @notice s_profits of the contract from "listingPrice" fees
    uint256 private s_profits;

    /// @notice contract deployer
    address immutable private i_owner;
    // versioning needed for biconomy gasless tx
    string public override versionRecipient = "v0.0.1";
    
    address private immutable i_dutchFactoryContract;
    address private immutable i_engFactoryContract;
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -----------------------------------
    // Events
    // -----------------------------------  

    /// @notice signal used to update the website in real time after mint
    /// @dev adding marketItemCreate log
    event marketItemCreated(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        uint256 price,
        bool onSale,
        address indexed owner,
        address seller,
        address minter
    );
    /// @notice signal used to update the website in real time after putting item on sale
    event marketItemOnSale(
        address indexed nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller,
        address minter
    );
    /// @notice signal used to update the website in real time after item has been bought
    event marketItemBought(
        address indexed nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bool onSale,
        address owner,
        address indexed seller,
        address minter
    );
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -----------------------------------
    // Modifiers
    // -----------------------------------

   /*  // In Case modifiers and requires get more gas efficient in the future
    /// @notice checking if correct listing price has been paid
    /// @dev modifer to get the exact listing price
    modifier paidListingPrice() {
        require(msg.value == LISTINGPRICE, "You need to pay the LISTINGPRICE");
        _;
    } */

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // -----------------------------------
    // Functions
    // -----------------------------------

    /// @notice setting owner to contract deployer
    constructor(address _DutchAuctionFactory, address _EngFactoryContract, address forwarder) {
        i_owner = payable(_msgSender());
        i_dutchFactoryContract = _DutchAuctionFactory;
        i_engFactoryContract = _EngFactoryContract;
        _setTrustedForwarder(forwarder);
    }

    /// @notice used for tips to project creator/deployer
    fallback() payable external {
        s_profits += msg.value;
    }



    /// @notice A way for the contract owner to withdraw his profits, tips/minting fees
    function withdrawContractsProfits() external nonReentrant {
        if(_msgSender() != i_owner){
            revert NftMarketPlace__NotOwnerOfContract(_msgSender());
        }
        /* require(_msgSender() == i_owner, "only the owner can call this function"); */
        (bool success, ) = payable(_msgSender()).call{value: s_profits}("");
        require(success, "Payment wasn't successfull");
        s_profits = 0;
    }

    /// @notice mint NFT
    /// @dev creates marketToken and mints nft at given address(_nftContractAddress), transfers
    /// @param _nftContractAddress address of the NFT contract you want to interact with 
    function mintMarketToken(address _nftContractAddress)
        external
        payable

    {   
        if(msg.value != LISTINGPRICE ){
            revert NftMarketPlace__DidNotPayLISTINGPRICE( msg.value);
        }
        /// @dev incrementing ID
        s_tokenIds.increment();
        uint256 currentTokenID = s_tokenIds.current();

        /// @dev create MarketToken with current ID and save inside mapping
        idToMarketToken[currentTokenID] = MarketToken(
            _nftContractAddress,
            currentTokenID,
            0,
            false,
            payable(_msgSender()),
            payable(address(0)),
            _msgSender()
        );

        /// @dev adding listing price to contract s_profits
        s_profits += msg.value;
        emit marketItemCreated(_nftContractAddress, currentTokenID, 0, false, _msgSender(),address(0),_msgSender());
    }
    
    /// @notice sell NFT
    /// @dev putting market Token for sale on marketplace
    /// @param _tokenId tokenID of NFT putting up for sale, sellPrice the price you want the NFT to be sold for, _nftContractAddress contract address of the NFT you want to sell 
    function saleMarketToken(
        uint256 _tokenId,
        uint256 sellPrice,
        address _nftContractAddress
    ) external {
        if(sellPrice <= 0){
            revert NftMarketPlace__invalidSellPrice(_msgSender(), sellPrice);
        }
        if(!idToMarketToken[_tokenId].onSale == false){
            revert NftMarketPlace__TokenAlreadyOnSale(_tokenId);
        }
        if(idToMarketToken[_tokenId].owner != _msgSender()){
            revert NftMarketPlace__NotOwnerOfToken(_msgSender(), _tokenId);
        }
        /* /// @dev sell price must be > 0 Wei
        require(sellPrice > 0, "Price must be atleast one wei");
        /// @dev token can't be on sale already
        require(
            idToMarketToken[_tokenId].onSale == false,
            "The token is already on sale"
        );
        /// @dev seller must be owner
        require(
            idToMarketToken[_tokenId].owner == _msgSender(),
            "only owner of token can call this method"
        ); */
        /// @dev transferring the NFT created in given contract address from current caller to this marketplace
        IERC721(_nftContractAddress).transferFrom(
            _msgSender(),
            address(this),
            _tokenId
        );

        /// @dev updating state of for sale listed NFT
        
        idToMarketToken[_tokenId].price = sellPrice;
        idToMarketToken[_tokenId].onSale = true;
        idToMarketToken[_tokenId].seller = payable(_msgSender());
    }

    /// @notice buy NFT
    /// @dev buy market Token which is currently up for sale
    /// @param _tokenId token ID of market Token chosen to be bought, _nftContractAddress contract address of NFT chosen to be bought
    function buyMarketToken(uint256 _tokenId, address _nftContractAddress)
        external
        payable nonReentrant 
    {   
        if(_tokenId <= 0){
            revert NftMarketPlace__TokenIdUnderOne(_tokenId);
        }
        if(idToMarketToken[_tokenId].onSale != true){
            revert NftMarketPlace__TokenNotOnSale(_tokenId);
        }
        if(msg.value != idToMarketToken[_tokenId].price){
            revert NftMarketPlace__UnequalToSellPrice(msg.value);
        }
        if(_msgSender() == idToMarketToken[_tokenId].owner){
            revert NftMarketPlace__CallerIsOwnerOfToken(_msgSender(), _tokenId);
        }
        /* /// @dev require existing ID
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
            _msgSender() != idToMarketToken[_tokenId].owner,
            "You cannot buy from yourself (atleast not with the same address)"
        ); */

       
        /// @dev transferring NFT created in given address from this marketplace to the _msgSender() (buyer)
        IERC721(_nftContractAddress).transferFrom(
            address(this),
            _msgSender(),
            _tokenId
        );

        /// @dev transferring the eth from contract (provided by buyer) to the seller of the nft
        payable(idToMarketToken[_tokenId].seller).transfer(msg.value);

        /// @dev update the state of bought market Token
        idToMarketToken[_tokenId].price = 0;
        idToMarketToken[_tokenId].onSale = false;
        idToMarketToken[_tokenId].owner = payable(_msgSender());
    }

    /// @notice getting all tokens which are currently up for sale
    /// @return array of Market Tokens currently up for sale
    function fetchAllTokensOnSale() external view returns (MarketToken[] memory) {

        /// @dev saving current ID to save some gas
        uint256 currentLastTokenId = s_tokenIds.current();

        uint256 tokensOnSale;
        /// @dev loop to get the number of tokens on sale
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                tokensOnSale += 1;
            }
        }
        /// @dev creating a memory array with the length of num "of tokens on sale"
        MarketToken[] memory res = new MarketToken[](tokensOnSale);
        uint256 count = 0;
        /// @dev updating the memory array with all market tokens with onSale == true
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].onSale == true) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }

    
    /* delete/burn NFT function can be added here*/


    /// @notice getting all tokens which currently belong to _msgSender()
    /// @return array of Market Tokens which currently belong to _msgSender()
    function fetchAllMyTokens() external view returns (MarketToken[] memory) {
        /// @dev saving current ID to save some gas
        uint256 currentLastTokenId = s_tokenIds.current();

        uint256 yourTokenCount;
        /// @dev loop to get the number of tokens currently belonging to _msgSender()
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == _msgSender()) {
                yourTokenCount += 1;
            }
        }
        /// @dev creating a memory array with the length of num "of tokens belonging to _msgSender()"
        MarketToken[] memory res = new MarketToken[](yourTokenCount);
        uint256 count = 0;
        /// @dev updating the memory array with all market tokens with onSale == true
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].owner == _msgSender()) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }
    /// @notice getting all tokens which got minted by the caller
    /// @return array of Market Tokens which got minted by the caller
    function fetchTokensMintedByCaller()
        external
        view
        returns (MarketToken[] memory)
    {   
        /// @dev saving current ID to save some gas
        uint256 currentLastTokenId = s_tokenIds.current();

        uint256 yourMintedTokens;
        /// @dev loop to get the number of tokens minted by caller
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == _msgSender()) {
                yourMintedTokens += 1;
            }
        }
        /// @dev creating a memory array with the length of num "minted by caller"
        MarketToken[] memory res = new MarketToken[](yourMintedTokens);
        uint256 count = 0;
        /// @dev updating the memory array with all market tokens which are minted by the caller
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            if (idToMarketToken[i].minter == _msgSender()) {
                res[count] = idToMarketToken[i];
                count += 1;
            }
        }
        return res;
    }
    /// @notice returns all market tokens
    /// @return array of all market tokens
    function fetchAllTokens() external view returns (MarketToken[] memory) {
        uint256 currentLastTokenId = s_tokenIds.current();

        MarketToken[] memory res = new MarketToken[](currentLastTokenId);
        uint256 count = 0;
        for (uint256 i = 1; i <= currentLastTokenId; i++) {
            res[count] = idToMarketToken[i];
            count += 1;
        }
        return res;
    }

    function McreateDutchAuction(uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId) external {
        IDutchAuctionFactory(i_dutchFactoryContract).createDutchAuction(_startingPrice,
        _discountRate,
        _nft,
       _nftId);
    }

    function McreateEngAuction(address _nft,
        uint _nftId,
        uint _startingBid) external {
        IEngAuctionFactory(i_engFactoryContract).createEngAuction(_nft,
       _nftId,
        _startingBid);
    }
    /// @return listing price
    function getListingPrice() external pure returns(uint){
        return LISTINGPRICE;
    }
}