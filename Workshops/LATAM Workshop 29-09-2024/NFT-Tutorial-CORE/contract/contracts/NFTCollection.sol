// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct TokenURI {
        string tokenURI;
        string image;
    }

    struct NFTItem {
        string name;
        string description;
        string imageURI;
    }

    mapping(uint256 => NFTItem) private _tokenDetails;

    constructor() ERC721("NFTCollection", "NFTC") Ownable() {}

    function mintNFT(
        string memory name,
        string memory description,
        string memory imageURI
    ) public onlyOwner returns (uint256) {
        require(bytes(name).length > 0, "Name is required");
        require(bytes(description).length > 0, "Description is required");
        require(bytes(imageURI).length > 0, "Image URI is required");

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        TokenURI memory tokenURI = generateTokenURI(
            name,
            description,
            imageURI
        );

        _tokenDetails[newItemId] = NFTItem({
            name: name,
            description: description,
            imageURI: imageURI
        });

        _setTokenURI(newItemId, tokenURI.tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    function getTokenDetails(
        uint256 tokenId
    ) public view returns (NFTItem memory) {
        require(_hasToken(tokenId), "Token does not exist");
        return _tokenDetails[tokenId];
    }

    function getNFTsByPage(
        uint256 page,
        uint256 pageSize
    ) public view returns (NFTItem[] memory) {
        require(page > 0, "Page number should be greater than 0");
        uint256 startIndex = (page - 1) * pageSize;
        uint256 endIndex = startIndex + pageSize;
        uint256 totalItems = _tokenIds.current();

        if (endIndex > totalItems) {
            endIndex = totalItems;
        }

        require(startIndex < totalItems, "Page number out of range");

        NFTItem[] memory items = new NFTItem[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            items[i - startIndex] = _tokenDetails[i];
        }

        return items;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function _hasToken(uint256 tokenId) internal view returns (bool) {
        try this.ownerOf(tokenId) returns (address) {
            return true;
        } catch {
            return false;
        }
    }

    function generateTokenURI(
        string memory name,
        string memory description,
        string memory image
    ) internal pure returns (TokenURI memory) {
        string memory json = string(
            abi.encodePacked(
                '{"name": "',
                name,
                '", "description": "',
                description,
                '", "image": "',
                image,
                '"}'
            )
        );

        string memory base64Json = Base64.encode(bytes(json));

        string memory tokenURI = string(
            abi.encodePacked("data:application/json;base64,", base64Json)
        );

        TokenURI memory tokenURIStruct = TokenURI(tokenURI, image);

        return tokenURIStruct;
    }
}
