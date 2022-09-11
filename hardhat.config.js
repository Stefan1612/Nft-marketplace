const { DirectionsRailwayTwoTone } = require("@mui/icons-material");

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

const {
  ETHER_SCAN_API_KEY,
  REPORT_GAS,
  APP_PRIVATE_KEY,
  COINMARKETCAP_API_KEY,
  APP_RINKEBY_ENDPOINT,
  APP_GOERLI_ENDPOINT,
} = process.env;
// eslint-disable-next-line
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  accounts.forEach((account) => console.log(account));
});

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, // default is 31337: https://hardhat.org/metamask-issue.html
    },
    localhost: {
      // used for stand-alone hardhat network
      chainId: 1337,
    },
    rinkeby: {
      chainId: 4,
      url: APP_RINKEBY_ENDPOINT,
      accounts: [APP_PRIVATE_KEY],
    },
    goerli: {
      chainId: 5,
      url: APP_GOERLI_ENDPOINT,
      accounts: [APP_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: REPORT_GAS || false,
    currency: "ETH",
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  solidity: {
    compilers: [{ version: "0.8.7" }, { version: "0.8.13" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  // increasing the timeout for VRF tests. They take longer than usual tests
  mocha: {
    timeout: 3000000,
  },
};
