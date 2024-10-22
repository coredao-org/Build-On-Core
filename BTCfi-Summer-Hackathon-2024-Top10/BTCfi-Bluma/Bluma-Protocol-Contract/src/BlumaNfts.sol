// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol"; // Import IERC721 to ensure it is recognized

contract BlumaNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("BlumaNFT", "BLUM") {}

    function safeMint(address to, string memory uri) external {
        _nextTokenId = _nextTokenId + 1;
        _safeMint(to, _nextTokenId);
        _setTokenURI(_nextTokenId, uri);
    }

    function getNextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }
    

    function ownerOf(uint256 tokenId) public view override(ERC721, IERC721) returns (address) {
        return super.ownerOf(tokenId);
    }

    function balanceOf(address owner) public view override(ERC721, IERC721) returns (uint256) {
        return super.balanceOf(owner);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
