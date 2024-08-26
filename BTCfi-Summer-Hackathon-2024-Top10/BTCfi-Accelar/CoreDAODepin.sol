// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CoreDaoDepin
 * @dev A modular infrastructure controlled by a DAO to manage DeFi capabilities
 */
contract CoreDaoDepin is ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    uint256 private _itemsSolds;
    uint256 private _NFTsMintedByOwner;
    uint256 public marketplaceFee = 3;  // Base 100 - 3 equals 3%

    // ICP oracle address allowed to manage the tokens - can be changed through a DAO, for instance
    address public icpOracle;

    // Flag to enable or disable contract functionalities - controlled by DAO
    bool public isEnabled = true;

    // ERC20 token addresses (USDC and USDT) used for transactions, both have 6 decimals
    IERC20 public USDCAddress;
    IERC20 public USDTAddress;

    // Payment type enum to define payment methods for marketplace transactions
    enum PaymentType {
        Matic,
        USD
    }

    // Mapping to track NFTs minted per wallet
    mapping(uint256 => mapping(address => uint256)) public nftsMintedPerWallet;
    // Mapping to store URIs for NFT characters
    mapping(uint256 => string) public NFTCharacterToURI;

    // Struct to represent an item in the marketplace - each NFT has its own item
    struct Item {
        uint256 id;
        uint256 bidAmount;
        string akashTxHash;
        string uri;
        bool live;
        uint256 price;
        address seller;
        PaymentType paymentType;
    }

    // Mapping to store items in the marketplace
    mapping(uint256 => Item) public Items;

    /**
     * @dev Constructor to initialize the contract with ICP oracle address and marketplace fee
     * @param _icpOracle Address of the ICP oracle
     * @param _marketplaceFee Fee for the marketplace transactions
     */
    constructor(address _icpOracle, uint256 _marketplaceFee, address initialOwner) Ownable(initialOwner) ERC721("AccelarBTCDepin", "ACD") {
        icpOracle = _icpOracle;
        marketplaceFee = _marketplaceFee;
    }

    /**
     * @dev Sets the ERC20 token addresses for USDC and USDT
     * @param _USDCAddress Address of the USDC token contract
     * @param _USDTAddress Address of the USDT token contract
     */
    function setTokensAddress(address _USDCAddress, address _USDTAddress) public onlyOwner {
        USDCAddress = IERC20(_USDCAddress);
        USDTAddress = IERC20(_USDTAddress);
    }

    event DeploymentCreated(uint256 id, string uri, address minter);
    event DeploymentCanceled(uint256 id);

    /**
     * @dev Updates the deployment status for a given token ID by the ICP oracle
     * @param _tokenId Token ID of the deployment
     * @param _akashHash Akash transaction hash
     */
    function updateDeployment(uint256 _tokenId, string memory _akashHash) public {
        require(icpOracle == msg.sender, "Only Oracle can change deployment");

        Items[_tokenId].akashTxHash = _akashHash;
    }

    /**
     * @dev Allows the owner to mint NFTs for users
     * @param _uri URI of the NFT
     * @param _to Address of the recipient
     */
    function createDeployment(string memory _uri, address _to) public payable {
        require(isEnabled, "The contract is not enabled");

        _tokenIds += 1;
        uint256 newItemId = _tokenIds;

        _safeMint(_to, newItemId);

        Items[newItemId] = Item({
            id: newItemId,
            bidAmount: msg.value,
            akashTxHash: "0x",
            live: true,
            uri: _uri,
            price: 0,
            seller: _to,
            paymentType: PaymentType(0)
        });

        emit DeploymentCreated(newItemId, _uri, _to);
    }

    /**
     * @dev Sets the contract enabled or disabled
     * @param _bool Boolean value to enable or disable the contract
     */
    function setContractEnabled(bool _bool) public onlyOwner {
        isEnabled = _bool;
    }

    /**
     * @dev Sets a new ICP oracle address
     * @param _address New ICP oracle address
     */
    function setNewICPOracle(address _address) public onlyOwner {
        icpOracle = _address;
    }

    /**
     * @dev Allows the owner to burn NFTs
     * @param _tokenId Token ID of the NFT to be burned
     */
    function burnNFTOwner(uint256 _tokenId) public onlyOwner {
        _burn(_tokenId);
    }

    /**
     * @dev Cancels the deployment of a given token ID
     * @param _tokenId Token ID of the deployment to be canceled
     */
    function cancelDeployment(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You are not the token owner");
        require(Items[_tokenId].live == true, "Deployment already canceled");

        Items[_tokenId].live = false;

        emit DeploymentCanceled(_tokenId);
    }

    // Marketplace events
    event itemAddedForSale(uint256 id, uint256 price, address seller);
    event itemSold(uint256 id, uint256 price, address seller, address buyer, PaymentType _paymentType);

    /**
     * @dev Lists an NFT for sale on the marketplace
     * @param _tokenId Token ID of the NFT
     * @param _price Sale price of the NFT
     * @param _paymentType Payment type for the sale (Matic or USD)
     */
    function putItemForSale(uint256 _tokenId, uint256 _price, PaymentType _paymentType) public {
        require(ownerOf(_tokenId) == msg.sender, "You are not the token owner");
        require(_price > 0, "Price needs to be greater than 0");

        Items[_tokenId].price = _price;
        Items[_tokenId].seller = msg.sender;
        Items[_tokenId].paymentType = _paymentType;

        _transfer(msg.sender, address(this), _tokenId);

        emit itemAddedForSale(_tokenId, _price, msg.sender);
    }

    /**
     * @dev Allows the owner to list an item for sale on the marketplace
     * @param _tokenId Token ID of the NFT
     * @param _price Sale price of the NFT
     * @param seller Address of the seller
     * @param _paymentType Payment type for the sale (Matic or USD)
     */
    function putItemForSaleOwner(uint256 _tokenId, uint256 _price, address seller, PaymentType _paymentType) public onlyOwner {
        require(_price > 0, "Price needs to be greater than 0");

        Items[_tokenId].price = _price;
        Items[_tokenId].seller = seller;
        Items[_tokenId].paymentType = _paymentType;

        _transfer(seller, address(this), _tokenId);

        emit itemAddedForSale(_tokenId, _price, seller);
    }

    /**
     * @dev Purchases an NFT listed for sale with Matic
     * @param _tokenId Token ID of the NFT
     */
    function buyItemWithFraxETH(uint256 _tokenId) payable external nonReentrant {
        require(_tokenIds >= _tokenId, "NFT does not exist");
        require(ownerOf(_tokenId) == address(this), "Token not for sale");
        require(msg.value >= Items[_tokenId].price, "Not enough funds sent");
        require(msg.sender != Items[_tokenId].seller, "The seller cannot buy it");
        require(Items[_tokenId].paymentType == PaymentType(0), "This item is not for Matic sale");

        uint256 priceEmit = Items[_tokenId].price;

        Items[_tokenId].price = 0;
        Items[_tokenId].seller = msg.sender;

        // 3% of royalties
        payable(Items[_tokenId].seller).transfer((msg.value * 97) / 100);

        _itemsSolds += 1;

        _transfer(address(this), msg.sender, _tokenId);

        emit itemSold(_tokenId, priceEmit, Items[_tokenId].seller, msg.sender, PaymentType(0));
    }

    enum USDPaymentType {
        USDC,
        USDT
    }

    /**
     * @dev Purchases an NFT listed for sale with USD (USDC or USDT)
     * @param _tokenId Token ID of the NFT
     * @param _USDPaymentType Payment type (USDC or USDT)
     */
    function buyItemWithUSD(uint256 _tokenId, USDPaymentType _USDPaymentType) external nonReentrant {
        require(_tokenIds >= _tokenId, "NFT does not exist");
        require(ownerOf(_tokenId) == address(this), "Token not for sale");
        require(msg.sender != Items[_tokenId].seller, "The seller cannot buy it");
        require(Items[_tokenId].paymentType == PaymentType(1), "This item is not for USD sale");

        if (_USDPaymentType == USDPaymentType(0)) {
            bool sent1 = USDCAddress.transferFrom(msg.sender, address(this), (Items[_tokenId].price * marketplaceFee) / 100);
            bool sent2 = USDCAddress.transferFrom(msg.sender, Items[_tokenId].seller, (Items[_tokenId].price * (100 - marketplaceFee)) / 100);
            require(sent1, "Failed to transfer to contract");
            require(sent2, "Failed to transfer to user");
        } else {
            bool sent1 = USDTAddress.transferFrom(msg.sender, address(this), (Items[_tokenId].price * marketplaceFee) / 100);
            bool sent2 = USDTAddress.transferFrom(msg.sender, Items[_tokenId].seller, (Items[_tokenId].price * (100 - marketplaceFee)) / 100);
            require(sent1, "Failed to transfer to contract");
            require(sent2, "Failed to transfer to user");
        }

        uint256 priceEmit = Items[_tokenId].price;

        Items[_tokenId].price = 0;
        Items[_tokenId].seller = msg.sender;

        _transfer(address(this), msg.sender, _tokenId);

        _itemsSolds += 1;

        emit itemSold(_tokenId, priceEmit, Items[_tokenId].seller, msg.sender, PaymentType(1));
    }

    event unsaledItem(uint256 tokenId, address seller);

    /**
     * @dev Removes an NFT from sale
     * @param _tokenId Token ID of the NFT
     */
    function unsaleItem(uint256 _tokenId) payable external {
        require(_tokenIds >= _tokenId, "NFT does not exist");
        require(ownerOf(_tokenId) == address(this), "NFT not for sale");
        require(msg.sender == Items[_tokenId].seller, "Only the seller can unsale it");

        Items[_tokenId].price = 0;

        _transfer(address(this), msg.sender, _tokenId);

        emit unsaledItem(_tokenId, msg.sender);
    }

    /**
     * @dev Withdraws Ether from the contract
     * @param _to Address to send the Ether to
     * @param _amount Amount of Ether to withdraw
     */
    function withdraw(address payable _to, uint256 _amount) public onlyOwner {
        (bool sent,) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    /**
     * @dev Withdraws ERC20 tokens from the contract
     * @param _to Address to send the tokens to
     * @param amount Amount of tokens to withdraw
     * @param _contractAddress Address of the ERC20 token contract
     */
    function withdrawERC20(address _to, uint256 amount, address _contractAddress) public onlyOwner {
        IERC20 contractAddress = IERC20(_contractAddress);
        bool sent = contractAddress.transfer(_to, amount);
        require(sent, "Failed to send ERC20");
    }

    function getAllNFTIds(address owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }
}
