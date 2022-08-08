//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

// IMPORTS 
// debug tool
import "hardhat/console.sol";
// TokenURI Storage used to handle ipfs nft-links
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// LIBRARIES
// keeping state of tokenURI
import "@openzeppelin/contracts/utils/Counters.sol";

// ERROR MESSAGES
// caller is not the owner nor has approval for tokenID
error NotOwner(address sender, uint i);

// CONTRACTS
/// @title NFT contract for "Ape Family"
/// @author Stefan Lehmann/Stefan1612/SimpleBlock (same person but different pseudo identities)
/// @notice Contract used to create new NFT's and keep state of previous ones
/// @dev Basic erc721 contract for minting, saving tokenURI and burning tokens  
// Please NOTE: I've added custom error messages in this version due to gas efficiency BUT due to the unconvential 
// syntax I have also added the require statements in the comments for an less gas efficient but more readable alternative.
contract NFT is ERC721URIStorage {

    /// @notice decrement, increment, current ID from Counter library
    using Counters for Counters.Counter;

    /// @notice keeping track of tokenIds
    Counters.Counter private s_tokenIds;

    /// @notice address of the marketplace I want the this type of NFT to interact with
    address private immutable i_marketplace;

    /// @notice setting name, symbol to fixed values
    constructor(address _marketplace) ERC721("Ape Family", "APF") {
        i_marketplace = _marketplace;
    }

    /// @notice mint function(createNFT)
    /// @return current tokenID
    function createNFT(string memory tokenURI) external returns (uint256) {
        // incrementing the id everytime after minting
        s_tokenIds.increment();
        // unique current ID
        uint256 currentTokenId = s_tokenIds.current();

        // ERC721 _mint
        _safeMint(msg.sender, currentTokenId);

        // ERC721URIStorage _setTokenURI
        _setTokenURI(currentTokenId, tokenURI);

        // ERC721 setApprovalForAll to give marketplace access 
        setApprovalForAll(i_marketplace, true);

        return currentTokenId;
    }

    /// @notice burns NFT's
    /// @dev sends token to address(0)
    function burn(uint256 tokenId) external virtual {

        // In case require statements get more gas efficient in the future
       /*  require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        ); */

        if( !_isApprovedOrOwner(_msgSender(), tokenId)){
            revert NotOwner(msg.sender, tokenId);
        }

        // sends token to address(0)
        _burn(tokenId);
    }
}
