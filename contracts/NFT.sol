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

// CONTRACTS
/// @title NFT contract for "Ape Family"
/// @author Stefan Lehmann/Stefan1612/SimpleBlock
/// @notice Contract used to create new NFT's and keep state of previous ones
/// @dev Basic erc721 contract for minting, saving tokenURI and burning tokens
contract NFT is ERC721URIStorage {

    /// @notice decrement, increment, current ID from Counter library
    using Counters for Counters.Counter;

    /// @notice keeping track of tokenIds
    Counters.Counter private _tokenIds;

    /// @notice address of the marketplace I want the this type of NFT to interact with
    address private marketplace;

    /// @notice setting name, symbol to fixed values
    constructor(address _marketplace) ERC721("Ape Family", "APF") {
        marketplace = _marketplace;
    }

    /// @notice mint function(createNFT)
    /// @return  sad
    function createNFT(string memory tokenURI) public returns (uint256) {
        //incrementing the id everytime after minting
        _tokenIds.increment();
        //unique current ID
        uint256 currentTokenId = _tokenIds.current();

        //ERC721 _mint
        _safeMint(msg.sender, currentTokenId);

        //ERC721URIStorage _setTokenURI
        _setTokenURI(currentTokenId, tokenURI);

        //ERC721 setApprovalForAll
        setApprovalForAll(marketplace, true);

        return currentTokenId;
    }

    //sends tokens to address(0)
    function burn(uint256 tokenId) external virtual {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        _burn(tokenId);
    }
}
