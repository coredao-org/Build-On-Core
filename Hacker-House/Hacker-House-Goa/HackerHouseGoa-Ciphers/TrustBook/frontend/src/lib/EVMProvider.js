import {
  BitcoinNetwork,
  BitcoinWallet,
  BitcoinProvider,
  EVMWallet,
} from "@catalogfi/wallets";
import {
  Orderbook,
  Chains,
  Assets,
  Actions,
  parseStatus,
  TESTNET_ORDERBOOK_API,
} from "@gardenfi/orderbook";
import { GardenJS } from "@gardenfi/core";
import { JsonRpcProvider, Wallet } from "ethers";

// Create a Bitcoin wallet from a testnet private key (WIF format)
const bitcoinWallet = BitcoinWallet.fromWIF(
  "pvtkey", // Example WIF for Bitcoin Testnet
  new BitcoinProvider(BitcoinNetwork.Testnet)
);

// Create your EVM wallet for Ethereum testnet (Hexadecimal format)
const signer = new Wallet(
  "pvtkey", // Example Ethereum testnet private key (without 0x prefix)
  new JsonRpcProvider(
    "https://arbitrum-sepolia.infura.io/v3/"
  ) // Goerli testnet RPC URL
);
const evmWallet = new EVMWallet(signer);

(async () => {
  const orderbook = await Orderbook.init({
    url: TESTNET_ORDERBOOK_API, // Testnet Orderbook API URL
    signer,
  });

  const wallets = {
    [Chains.bitcoin_testnet]: bitcoinWallet,
    [Chains.ethereum_sepolia]: evmWallet,
  };

  const garden = new GardenJS(orderbook, wallets);

  const sendAmount = 0.0001 * 1e8; // 0.0001 BTC in Satoshis
  const receiveAmount = (1 - 0.3 / 100) * sendAmount; // Apply a 0.3% fee to the amount

  const orderId = await garden.swap(
    Assets.bitcoin.BTC,
    Assets.ethereum.WBTC,
    sendAmount,
    receiveAmount
  );

  garden.subscribeOrders(await evmWallet.getAddress(), async (orders) => {
    const order = orders.filter((order) => order.ID === orderId)[0];
    if (!order) return;

    const action = parseStatus(order);

    if (
      action === Actions.UserCanInitiate ||
      action === Actions.UserCanRedeem
    ) {
      const swapper = garden.getSwap(order);
      const swapOutput = await swapper.next();
      console.log(
        `Completed Action ${swapOutput.action} with transaction hash: ${swapOutput.output}`
      );
    }
  });
})();
