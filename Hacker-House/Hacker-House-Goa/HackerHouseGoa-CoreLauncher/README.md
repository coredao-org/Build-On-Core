# Core Launcher : CoreDAO Token Generator and Liquidity Pool Creator

[<img src="https://pbs.twimg.com/media/GUi8XYpWMAA8Lzd?format=jpg&name=large" width="100%">](https://www.youtube.com/watch?v=Te1_SB_eTJU)

## Overview

Welcome to the Core Launcher CoreDAO Token Generator and Liquidity Pool Creator! This decentralized application (dApp) allows users to easily create their own ERC20 tokens and set up liquidity pools on the CoreDAO blockchain. The platform leverages the power of CoreDAO's performance, security, and cross-chain interoperability to provide a robust token and liquidity generation experience.

## Links

- **Demo** : https://core-launcher.netlify.app/
- **Video** : https://www.youtube.com/watch?v=Te1_SB_eTJU
- **Git Repo** : https://github.com/Chintan5942/dao-meme

## Features

- **ERC20 Token Creation**: Users can create customized ERC20 tokens by specifying parameters such as token name, symbol, initial supply, and decimals.
- **Liquidity Pool Creation**: Instantly create liquidity pools for your token on CoreDAO using the integrated router contract.
- **CoreDAO Integration**: The platform is fully integrated with CoreDAO, ensuring high performance, security, and seamless cross-chain interoperability.
- **Real-time Analytics**: The platform offers real-time tracking and analytics for the tokens and liquidity pools created.
- **User-Friendly Interface**: Built with Next.js, the application provides a smooth and responsive user experience.

## Contract Addresses

- **Router Contact** : https://scan.test.btcs.network/address/0xd842784DBaE52b1cb237d89D70e58BdA19272a53#code
- **Factory Contact** : https://scan.test.btcs.network/address/0xdf13b177d26F0bF78ca4bC315144903253B8f3B7
- **Weth Contact** : https://scan.test.btcs.network/address/0xe4eFa38c357dAC678FB289b22DC317de0984cA9f
- **ERC20 Contact** : https://scan.test.btcs.network/address/0x5518445b6EFfC9A5243934DE32237789c5305F06#code
- **Liquidity Contact** : https://scan.test.btcs.network/token/0x9937ed4030e6b3362e34062a337f01bbbf5fd16a?a=0x94bfd151f6b428daba73e889db68583bd5bfd4a5#contract

## Getting Started

### Prerequisites

Before you can run this project locally, ensure you have the following installed:

- Node.js (v14.x or higher)
- npm or yarn
- Git

### Installation

1. Fork this Repository:

2. Clone the repository:

   ```bash
   git clone https://github.com/Chintan5942/dao-meme.git
   cd dao-meme
   ```

3. Install the required dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

To start the application locally, run:

```bash
npm run dev
# or
yarn dev
```

This will start the development server, and you can access the application at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

This will create an optimized build in the `.next` folder, ready for deployment.

### Deploying to Production

To deploy the application to a production environment, follow these steps:

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:

   ```bash
   npm run start
   # or
   yarn start
   ```

3. Optionally, you can deploy the application to a platform like Vercel, Netlify, or your own server.

## Usage

1. **Create a Token**: Navigate to the "Create Token" section, input the desired token details (name, symbol, initial supply, decimals), and click "Generate Token". The smart contract will deploy your new token on CoreDAO.

2. **Create a Liquidity Pool**: Once your token is created, navigate to the "Create Liquidity Pool" section. Input the token address, and the amount of tokens and CORE you wish to pair, and the platform will automatically create the liquidity pool using the integrated router contract.

3. **Manage Your Tokens and Pools**: The platform provides a dashboard where you can view and manage your created tokens and liquidity pools, with real-time data and analytics.

## Technologies Used

- **Next.js**: React framework for building the user interface and handling server-side rendering.
- **CoreDAO**: Blockchain platform where the tokens and liquidity pools are deployed.
- **Web3.js**: JavaScript library for interacting with the blockchain.
- **Wagmi**: A lightweight JavaScript library for interacting with the Ethereum blockchain, used here for CoreDAO.
- **Tailwind CSS**: Utility-first CSS framework for styling the application.

## Contributing

We welcome contributions to this project! Please follow the steps below to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to the CoreDAO community for their support and inspiration. and to our team mates [Chintan Rabadiya](https://github.com/Chintan5942), [Kunal Dhongade](https://www.github.com/kunaldhongade) & [Asif Sayyad](https://www.github.com/asifsayyad25)
