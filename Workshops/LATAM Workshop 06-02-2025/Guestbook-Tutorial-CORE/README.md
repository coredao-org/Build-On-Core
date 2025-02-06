# GuestBook dApp on Core

## What can you do in this tutorial?

## Software Prerequisites
* [Git](https://git-scm.com/) v2.44.0
* [Node.js](https://nodejs.org/en) v20.11.1
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v10.2.4
* [MetaMask Web Wallet Extension](https://metamask.io/download/)

## Setting up the development environment

1. Download this repository

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
