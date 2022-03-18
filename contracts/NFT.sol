//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    //decrement, increment, current ID from Counter library
    using Counters for Counters.Counter;

    //keeping track of tokenIds
    Counters.Counter private _tokenIds;

    //address of the marketplace i want the this type of NFT to interact with
    address private marketplace;

    //setting name, symbol
    constructor(address _marketplace) ERC721("Ape Gang ", "APG") {
        marketplace = _marketplace;
    }

    //my mint function(createNFT)
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
