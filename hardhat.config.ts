import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
// import "hardhat-gas-reporter"

import dotenv from "dotenv";
dotenv.config();

const { ALCHEMY_API_KEY, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

if (!ALCHEMY_API_KEY || !PRIVATE_KEY || !POLYGONSCAN_API_KEY) {
  throw new Error("Please set your ALCHEMY_API_KEY, PRIVATE_KEY, and POLYGONSCAN_API_KEY in a .env file");
}
const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      throwOnCallFailures: false,
      throwOnTransactionFailures: false
    }, // Hardhat Network
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://polygonscan.io/
    apiKey: POLYGONSCAN_API_KEY
  },
  // gasReporter: {
  //   currency: 'CHF',
  //   gasPrice: 21,
  //   enabled: false
  // }
};

export default config;
