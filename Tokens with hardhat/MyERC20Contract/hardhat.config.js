require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports={
  solidity:"0.8.24",
  networks:{
    sepolia:{
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_NEW_PRIVATE_KEY],
      timeout: 5000000,
      // accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },

  etherscan:{
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};
