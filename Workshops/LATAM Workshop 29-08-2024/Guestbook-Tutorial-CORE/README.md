# GuestBook dApp on Core

## What can you do in this tutorial?

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

1. Inside the /contract/contracts folder is the Guestbook.sol file which will contain the smart contract code to be used for this tutorial.

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Guestbook {
    struct Entry {
        address user;
        string message;
        uint timestamp;
    }

    Entry[] public entries;

    event EntryAdded(address indexed user, string message, uint timestamp);

    function addEntry(string calldata _message) external {
        entries.push(Entry({
            user: msg.sender,
            message: _message,
            timestamp: block.timestamp
        }));
        emit EntryAdded(msg.sender, _message, block.timestamp);
    }

    function getEntries(uint _startIndex, uint _limit) external view returns (Entry[] memory) {
        require(_startIndex < entries.length, "Start index out of bounds");

        uint endIndex = _startIndex + _limit > entries.length ? entries.length : _startIndex + _limit;
        uint numEntries = endIndex - _startIndex;
        Entry[] memory paginatedEntries = new Entry[](numEntries);

        for (uint i = 0; i < numEntries; i++) {
            paginatedEntries[i] = entries[_startIndex + i];
        }

        return paginatedEntries;
    }
}

```

## Compiling Smart Contract

1. To compile the `Guestbook` smart contract defined in the `Guestbook.sol`, from the /contract directory run the following command. (Every time a change is made to the contract code we must recompile it).

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

  const Guestbook = await ethers.getContractFactory("Guestbook");

  const guestbook = await Guestbook.deploy();

  console.log("Contract Address:", guestbook.address);
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

2. In the path src/contractABI we must copy the abi of our smart contract in the case of making modifications, this information will be obtained from contract/artifacts/contracts/Guestbook.json.

3. Once the smart contract is deployed, it is necessary to copy the address and replace it in each of the components where we make calls to the contract, in this case in ...

4. To test if things are working fine, run the application by using the following command. This will serve applciation with hot reload feature at [http://localhost:5173](http://localhost:5173/)

```bash
npm run dev
```

## Add message

1. To add a new message, you must first enter the text of the new message.
2. Once this is done, click on the "Add Message" button and accept the transaction in metamask.

<img src="https://raw.githubusercontent.com/open-web-academy/GuestBook-Tutorial-CORE/master/src/public/NewMessage.gif" width="50%">

## Get Messages

1. To get the list of messages added by users, you only have to go to the "Messages List" option in the menu where a table will be displayed with the entire list of messages saved in the smart contract.

<img src="https://raw.githubusercontent.com/open-web-academy/GuestBook-Tutorial-CORE/master/src/public/MessagesList.gif" width="50%">
