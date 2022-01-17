require("@nomiclabs/hardhat-waffle");



module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    }
  },
  paths:{
    artifacts: "./src/artifacts",
  },
  solidity:{
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
};