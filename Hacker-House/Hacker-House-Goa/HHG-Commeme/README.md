# ComMeme Project

This project is designed to create and manage memecoins based on community engagement and virality.This works by allowing any user upload any meme in a gasless manner . Which is shown in the explore page, if certain memes get donation up to a threshold , it converts into a meme token and 30% is given to the funders and 10% of every contribution is given to a good legacy or cause which makes degen a positive sum game . In our case , we implemented UBI.

## Folder Structure

### 1. **commeme-frontend**
   - **Description**: The frontend of our application, built using Vite, Tailwind CSS, and Shadcn. This folder contains all the UI components and frontend logic. Fetches Blockchain data using graphql
   - **Tech Stack**: Vite, React, Tailwind CSS, Shadcn UI
   - **Key Files**:
     - `components.json`: Configuration for components used in the frontend.
     - `index.html`: The main HTML file for the frontend.
     - `tailwind.config.js`: Configuration for Tailwind CSS.

### 2. **contracts**
   - **Description**: This folder contains all the smart contracts written in Solidity. The contracts are divided into `core` and `helperContracts`.
   - **Core Contracts**:
     - `commemeFactory.sol`: The factory contract responsible for deploying new memecoins.
     - `anonVerifier.sol`: Verifies users using anon-Aadhaar.
     - `erc20Meme.sol`: The ERC20 token standard implementation for memecoins.
     - `commeme.sol`: This is the main logic of the application, it is responsible for minting the erc20 tokens , creating the  sushiswap pool, air droping the tokens and donationg the rest to a social cause smart contract.
   - **Helper Contracts**:
     - `safeMath.sol`: Provides mathematical functions to prevent overflows.
     - `ierc20.sol`: Interface for ERC20 tokens.
   - **Tech Stack**: Solidity, Hardhat
   - **Deployment**:
     - Here is the Polygon deployments
       ```bash
       Commeme Factory: https://polygonscan.com/address/0x3c287EBA998789a4a8C88ec0b251bb08978bb980
       ```
     - Here is the Core Dao Mainnet deployments
       ```bash
       COmmeme Factory: https://scan.coredao.org/address/0xb8F55945296407B8f9a7095F0c71b221a257b2F2
       ```

### 3. **gasless**
   - **Description**: The gasless module is designed to eliminate the need for users to pay transaction fees, making it easier for users to onboard. It creates the memes without users paying gas
   - **Tech Stack**: Bun.js
   - **Key Files**:
     - `app.ts`: Core logic for gasless transactions.
     - `wallet.ts`: Handles wallet interactions for gasless features.

### 4. **indexer**
   - **Description**: This module is responsible for indexing and fetching data using our custom subgraph setup.
   - **Subfolders**:
     - `commeme-coredao`: Contains configurations and scripts related to the Core DAO.
     - `commeme-polygon`: Contains configurations and scripts related to the Polygon network.
   - **Tech Stack**: Graph Protocol, Ponder
   - **Key Files**:
     - `ponder-config.ts`: Configuration for the Ponder indexing tool.
     - `schema.graphql`: GraphQL schema used by the subgraph.


