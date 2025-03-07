require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables from a .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {},
    localhost: { 
      url: "http://127.0.0.1:8545", 
    }
  }
};
