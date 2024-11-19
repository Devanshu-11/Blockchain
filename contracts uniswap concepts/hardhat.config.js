require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  allowUnlimitedContractSize: true,
  etherscan: {
    apiKey: {
      amoy:process.env.POLYGON_API_KEY,
    },
    customChains:[
      {
        network: "amoy",
        chainId: 80002,
        urls: {
          apiURL:"https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL:"https://www.oklink.com/polygonAmoy"
        }
      }
    ]
  
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [''],
  },
  sourcify: {
    enabled: true,
  },
  networks: {
    amoy:{
      url:`https://polygon-amoy.blockpi.network/v1/rpc/public`,
      accounts: [`0x${process.env.MY_NET_MASK_PRIVATE_KEY}`],
    },
  },
};