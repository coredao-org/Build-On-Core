# RuneBridge Smart Contract

## Overview

The `RuneBridge` smart contract is designed to manage the minting, transferring, and tracking of Rune tokens. It includes functionalities to interact with Oracle services, set transaction identifiers, and manage token contracts on the Ethereum blockchain.

## Contract Details

-   **Contract Name:** `RuneBridge`
-   **Solidity Version:** `^0.8.20`
-   **Dependencies:**
    -   [OpenZeppelin's `Ownable.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol)
    -   [OpenZeppelin's `IERC20.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol)
    -   Custom `RuneToken.sol` for managing Rune tokens.

## Features

1.  **Deploy New Runes**: The contract allows the owner to deploy new Rune tokens with a specified name, symbol, and maximum supply.
2.  **Transfer Runes**: Tokens can be transferred to specified addresses.
3.  **Transaction Tracking**: The contract tracks Rune transactions with source and target transaction IDs.
4.  **Oracle Integration**: The contract uses an Oracle for setting transaction IDs securely.
5.  **Fee Structure**: A fixed fee of 0.5 ether is required for receiving transactions.

## Methods

### `deployRune`

Deploys a new Rune token.

-   **Parameters:**
    
    -   `string runeId`: Unique identifier for the Rune.
    -   `string runeName`: Name of the Rune token.
    -   `string runeSymbol`: Symbol of the Rune token.
    -   `uint256 maxSupply`: Maximum supply of the Rune token.
-   **Access:** Only callable by the contract owner.
    

### `transferRune`

Transfers a specific amount of Rune tokens to a destination address.

-   **Parameters:**
    
    -   `string runeId`: Unique identifier for the Rune.
    -   `uint256 amount`: Amount of tokens to transfer.
    -   `address destination`: Destination address for the transfer.
-   **Access:** Only callable by the contract owner.
    

### `setTargetTxId`

Sets the target transaction ID for a specific transaction.

-   **Parameters:**
    
    -   `string txIdentifier`: Identifier for the transaction.
    -   `string targetTxId`: Target transaction ID to set.
-   **Access:** Only callable by the Oracle.
    

### `setSourceTxId`

Sets the source transaction ID for a specific transaction.

-   **Parameters:**
    
    -   `string txIdentifier`: Identifier for the transaction.
    -   `string sourceTxId`: Source transaction ID to set.
-   **Access:** Only callable by the Oracle.
    

### `receiveTransaction`

Receives and records a new Rune transaction.

-   **Parameters:**
    
    -   `string runeId`: Unique identifier for the Rune.
    -   `uint256 amount`: Amount of tokens transferred.
    -   `address sourceAddress`: The source address of the tokens.
    -   `string txIdentifier`: Unique transaction identifier.
-   **Access:** Publicly callable but requires a fee of 0.5 ether.
    

### `updateOracle`

Updates the Oracle address that is authorized to set transaction IDs.

-   **Parameters:**
    
    -   `address newOracle`: The new Oracle address.
-   **Access:** Only callable by the contract owner.
    

### `withdraw`

Withdraws the contract's ether balance to the owner's address.

-   **Access:** Only callable by the contract owner.

## Events

-   **`TransactionReceived`**: Emitted when a new transaction is recorded.
-   **`SourceTxIdSet`**: Emitted when the source transaction ID is set.
-   **`TargetTxIdSet`**: Emitted when the target transaction ID is set.
-   **`OracleUpdated`**: Emitted when the Oracle address is updated.
-   **`Withdrawn`**: Emitted when the contract balance is withdrawn.
-   **`RuneContractAdded`**: Emitted when a new Rune token contract is deployed and added.
-   **`RuneTransferred`**: Emitted when Rune tokens are transferred.

## Deployment

To deploy the `RuneBridge` contract:

1.  Ensure you have a Solidity development environment set up - project uses hardhat.
2.  Compile the contract - `npx hardhat compile`.
3.  Make sure you have environment variable set for owner's private key (`PRIVATE_KEY`). Deploy the contract using `npx hardhat run ./scripts/deploy-bridge.ts` 