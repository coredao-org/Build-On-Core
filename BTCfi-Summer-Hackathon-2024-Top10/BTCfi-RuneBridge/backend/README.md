
# RuneBridge Backend

## Overview

The RuneBridge backend serves two primary functions:

1.  **Data Source for Frontend:** It provides an API for the frontend to interact with the RuneBridge smart contract, allowing users to view transactions, their own asset balance, etc.
    
2.  **Oracle:** The backend acts as an Oracle, securely setting transaction information on contract and facilitating interactions with the RuneBridge smart contract.
    

## Environment Setup

To run the backend, you need to configure the environment variables in a `.env` file. Below is a list of required variables:

### Environment Variables

-   **`UNISAT_API_KEY`**: API key for accessing the UniSat service.
-   **`RUNE_BRIDGE_ADDRESS`**: The deployed address of the RuneBridge smart contract.
-   **`CORE_NODE_URL`**: URL of the Core blockchain node (e.g., `https://rpc.ankr.com/core`).
-   **`OWNER_PRIVATE_KEY`**: Private key of the owner, used for deploying and managing Rune tokens.
-   **`ORACLE_PRIVATE_KEY`**: Private key of the Oracle, used for securely setting transaction IDs.
-   **`DATABASE`**: Connection string for the database used by the backend (e.g., PostgreSQL, MongoDB).


## How to Build

To build the application, follow these steps:

1.  **Install Dependencies**: Ensure that you have Node.js and Yarn installed. Then, install the necessary packages:

>     yarn install
    
2.  **Compile the Application**: Build the NestJS application by running:

>     yarn build

This command compiles the TypeScript code into JavaScript, which is output to the `dist` directory.enter code here
    

## How to Run

Once the application is built, you can run it in either development or production mode.

### Development Mode

To run the application in development mode (with hot-reloading):

>     yarn start dev

### Production Mode

To run the application in production mode:

1.  Ensure that the application is built:

>     yarn build
    
2.  Start the application:
    
>     yarn start:prod
    
This will start the backend service, making it ready to handle requests and interact with the RuneBridge smart contract.
