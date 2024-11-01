# NFT Collection dApp on Core
In this tutorial, you will learn how to create a dApp for minting NFTs on the CORE network. 

## What can you do in this tutorial?

* Mint NFT: Learn how to mint new NFTs. This includes creating unique tokens, assigning metadata, and interacting with smart contracts to register NFTs on the CORE blockchain.
* Get NFTs: Find out how to get and view minted NFTs. Users will be able to view the details of their NFTs, including metadata and unique properties of each token, directly from the dApp.

## Software Prerequisites
* [Git](https://git-scm.com/) v2.44.0
* [Node.js](https://nodejs.org/en) v20.11.1
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v10.2.4
* [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started#installation) v10.2.4
* [MetaMask Web Wallet Extension](https://metamask.io/download/)

## Setting up the development environment

1. Download this repository


2. Install dependencies in the route /contract.
   
```bash
npm install
```

2. Install and configure MetaMask Chrome Extension to use with Core Testnet. Refer [here](https://docs.coredao.org/docs/Dev-Guide/core-testnet-wallet-config) for a detailed guide.

3. Create a secret.json file in the /contract folder and store the private key of your MetaMask wallet in it. Refer [here](https://metamask.zendesk.com/hc/en-us/articles/360015290032-How-to-reveal-your-Secret-Recovery-Phrase) for details on how to get MetaMask account's private key. Example:

```json
{"PrivateKey":"ef1150b212a53b053a3dee265cb26cd010065b9340b4ac6cf5d895a7cf39c923"}
```

:::caution
Do not forget to add this file to the `.gitignore` file in the root folder of your project so that you don't accidentally check your private keys/secret phrases into a public repository. Make sure you keep this file in an absolutely safe place!
:::

4. Copy the following into your `hardhat.config.js` file in /contract

```js
/**
 * @type import('hardhat/config').HardhatUserConfig
 */


require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-waffle");


const { PrivateKey } = require('./secret.json');


module.exports = {
   defaultNetwork: 'testnet',


   networks: {
      hardhat: {
      },
      testnet: {
         url: 'https://rpc.test.btcs.network',
         accounts: [PrivateKey],
         chainId: 1115,
      }
   },
   solidity: {
      compilers: [
        {
           version: '0.8.24',
           settings: {
            evmVersion: 'paris',
            optimizer: {
                 enabled: true,
                 runs: 200,
              },
           },
        },
      ],
   },
   paths: {
      sources: './contracts',
      cache: './cache',
      artifacts: './artifacts',
   },
   mocha: {
      timeout: 20000,
   },
};
```

## Writing Smart Contract

1. Inside the /contract/contracts folder is the NFTCollection.sol file which will contain the smart contract code to be used for this tutorial.

```javascript
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

    function getTokenDetails(uint256 tokenId)
        public
        view
        returns (NFTItem memory)
    {
        require(_hasToken(tokenId), "Token does not exist");
        return _tokenDetails[tokenId];
    }

    function getNFTsByPage(uint256 page, uint256 pageSize)
        public
        view
        returns (NFTItem[] memory)
    {
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
```

## Compiling Smart Contract

1. To compile the `NFTCollection` smart contract defined in the `NFTCollection.sol`, from the /contract directory run the following command. (Every time a change is made to the contract code we must recompile it).

```bash
npx hardhat compile
```

## Deploy and Interact with Smart Contract

1. Before deploying your smart contract on the Core Chain, it is best adviced to first run a series of tests making sure that the smart contract is working as desired. Refer to the detailed guide [here](https://docs.coredao.org/docs/Dev-Guide/hardhat#contract-testing) for more details.

2. Create a `scripts` folder in the /contract directory of your project. Inside this folder, create a file `deploy.js`; paste the following script into it.

```javascript
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploy contract with the account:", deployer.address);

  const NFTCollection = await ethers.getContractFactory("NFTCollection");

  const nftCollection = await NFTCollection.deploy();

  console.log("Contract Address:", nftCollection.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

```
3. Make sure your MetaMask wallet has tCORE test tokens for the Core Testnet. Refer [here](https://docs.coredao.org/docs/Dev-Guide/core-faucet) for details on how to get tCORE tokens from Core Faucet. 

4. Run the following command from the root directory of your project, to deploy your smart contract on the Core Chain.

```bash
npx hardhat run scripts/deploy.js
```

## Setting up Frontend

1. In the root folder, install all the dependencies.

```bash
npm install
```

2. In the path src/contractABI we must copy the abi of our smart contract in the case of making modifications, this information will be obtained from contract/artifacts/contracts/NFTCollection.json.

3. Once the smart contract is deployed, it is necessary to copy the address and replace it in each of the components where we make calls to the contract, in this case in src/components/Mint.tsx and src/components/Get.tsx

4. To test if things are working fine, run the application by using the following command. This will serve applciation with hot reload feature at [http://localhost:5173](http://localhost:5173/)

```bash
npm run dev
```

## Mint NFT

 1. To mint a new NFT, we will only have to enter 3 fields, the name, the description and the url of the image.
 2. Once this is done, click on the “Mint” button and accept the transaction in metamask.

<img src="https://raw.githubusercontent.com/open-web-academy/NFT-Tutorial-CORE/master/src/public/mint.gif" width="50%">

## Get NFT's

1. To get the NFT's minted only we will have to go to the option of “Get NFT's”.

<img src="https://raw.githubusercontent.com/open-web-academy/NFT-Tutorial-CORE/master/src/public/get.gif" width="50%">

