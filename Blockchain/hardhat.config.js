require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables from a .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_SEPOLIA_URL, // Infura Sepolia RPC URL from .env
      accounts: [process.env.PRIVATE_KEY], // Your wallet's private key
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // Optional: For verifying contracts on Etherscan
  },
};
