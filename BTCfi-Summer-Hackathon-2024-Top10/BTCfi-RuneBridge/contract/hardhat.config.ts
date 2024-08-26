import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const { PRIVATE_KEY, RPC_URL } = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: 'core',
  solidity: "0.8.20",
  networks: {
    core: {
      url: RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};

export default config;
