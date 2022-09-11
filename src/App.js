import "./App.css";
import React, { useState, useEffect } from "react";
// Routing
import { Route, Routes } from "react-router-dom";

// UI components Library
import { Box, ThemeProvider } from "@mui/material";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Web3Modal (metamask... connection)

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Walletlink from "walletlink";
import Authereum from "authereum";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Pages
import Home from "./Components/pages/Home";
import MintedTokens from "./Components/pages/MintedTokens";
import MintForm from "./Components/pages/MintForm";
import OwnNfts from "./Components/pages/OwnNfts";
import BiconomyCrossChain from "./Components/pages/BiconomyChrossChain";
import TransakGateway from "./Components/pages/TransakGateway";
import NftHistory from "./Components/NftHistory";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Additional Components

import Header from "./Components/Header";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Smart contract data

// ABI's
import NFT from "./config/contracts/NFT.json";
import NftMarketPlace from "./config/contracts/NftMarketPlace.json";

// addresses
import ContractAddress from "./config/contracts/map.json";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// connection to the blockchain
import { ethers } from "ethers";

// fetching general data (mainly used for IPFS links in this repo)
import axios from "axios";

// IPFS (NFT metadata gets stored on IPFS)
import { create } from "ipfs-http-client";
// needed for IPFS link
import { Buffer } from "buffer";

// UI library
import "bootstrap/dist/css/bootstrap.min.css";

// general theme set for our UI
import theme from "./Components/theme/theme";

function App() {
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // WEB3MODAL

  // setting ProviderOptions for our possible Web3Modal connections

  const providerOptions = {
    // enabling logging with binance wallet
    binancechainwallet: {
      package: true,
    },

    // enabling logging with authereum wallet
    authereum: {
      package: Authereum, // required
    },

    // enabling logging with walletconnect
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_PORJECT_ID,
      },
    },

    // enabling logging with Coinbase wallet
    walletlink: {
      package: CoinbaseWalletSDK, // CoinbaseWalletSDK, // Required
      options: {
        appName: "Marketplace", // Required - random APP name
        infuraId: process.env.REACT_APP_PORJECT_ID, // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 4, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
  };

  // setting web3Modal with our prior declared possible provider Options
  const web3Modal = new Web3Modal({
    network: "goerli",
    theme: "dark", // optional
    cacheProvider: false,
    providerOptions,
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Provider, Signer, user address

  // handle State of account address
  const [account, setAccount] = useState("");

  // provider and signer
  const [isProviderSet, setIsProviderSet] = useState(false);

  // will be updated with the "Connect" button
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();

  // infuraProvider - used to load data from the blockchain, no matter if user connected wallet

  const infuraProvider = new ethers.providers.InfuraProvider("goerli", {
    projectId: process.env.REACT_APP_PROJECT_ID,
    projectSecret: process.env.REACT_APP_PROJECT_SECRET,
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // market
  const eventContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    //infuraProvider //
    provider
  );
  //nft
  const eventContractNFT = new ethers.Contract(
    ContractAddress[5].NFT,
    NFT.abi,
    //infuraProvider //
    provider
  );
  const eventContractMarketInfura = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    infuraProvider
  );
  const eventContractNFTInfura = new ethers.Contract(
    ContractAddress[5].NFT,
    NFT.abi,
    infuraProvider
  );
  //signer calls
  //market
  const signerContractMarket = new ethers.Contract(
    ContractAddress[5].NftMarketPlace,
    NftMarketPlace.abi,
    signer
  );
  //NFT

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //side loaded
  useEffect(() => {
    loadOnSaleNFTs();

    loadOwnNFTs(); // user provider
    loadMintedNFTs(); // user provider

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //user connected with one of web3modal's providers
  useEffect(() => {
    loadOnSaleNFTs(); // infura provider

    loadOwnNFTs(); // user provider
    loadMintedNFTs(); // user provider

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProviderSet]);

  //side loaded
  async function FirstLoadGettingAccount() {
    /// using web3modal

    if (isProviderSet === false) {
      console.log("first Load ran");
      await web3Modal.clearCachedProvider();
      console.log("0");
      const instance = await web3Modal.connect();
      console.log("1");
      const provider_M = new ethers.providers.Web3Provider(instance);
      let signer_M = provider_M.getSigner();
      setProvider(provider_M);
      setSigner(signer_M);
      const accounts = await provider_M.send("eth_requestAccounts");
      setAccount(accounts[0]);
      setIsProviderSet(true);
      console.log("isProvidetSet === true");
    }

    /// using default metamask

    /* if (typeof window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      // eslint-disable-next-line
      window.alert("Install Metamask!");
    } */
  }

  //on chain change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  //on account change
  useEffect(() => {
    if (provider) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      console.log(accounts[0]);
      window.location.reload();
    }
  }
  //network
  const [network, setNetwork] = useState({
    chanId: "",
    name: "",
  });
  /*  async function gettingNetworkNameChainId() {
    const network = await provider.getNetwork();
    setNetwork(network);
  } */

  const [ownNFTs, setOwnNFTs] = useState([]);

  async function axiosGetTokenData(data) {
    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        //change the format to something im familiar with
        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    return tokenData;
  }

  async function loadOwnNFTs() {
    console.log("provider");
    /*   console.log(provider.provider); */
    /*   let providers = provider.provider;
    const signerContractMarket = new ethers.Contract(
      ContractAddress[5].NftMarketPlace,
      NftMarketPlace.abi,
      providers
    ); */

    /* let data = await signerContractMarket.fetchAllMyTokens();
    let tokenData = axiosGetTokenData(data);
    setOwnNFTs(tokenData); */

    /*  let data = await signerContractMarket.fetchAllMyTokens();
    let tokenData = axiosGetTokenData(data);
    setOwnNFTs(tokenData); */
    if (isProviderSet) {
      let data = await signerContractMarket.fetchAllMyTokens();

      const tokenData = await Promise.all(
        data.map(async (index) => {
          //getting the TokenURI using the erc721uri method from our nft contract
          const tokenUri = await eventContractNFT.tokenURI(index.tokenId);

          //getting the metadata of the nft using the URI
          const meta = await axios.get(tokenUri);

          //change the format to something im familiar with
          let nftData = {
            tokenId: index.tokenId,
            price: ethers.utils.formatUnits(index.price.toString(), "ether"),
            onSale: index.onSale,
            owner: index.owner,
            seller: index.seller,
            minter: index.minter,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };

          return nftData;
        })
      );
      setOwnNFTs(tokenData);
    }
  }

  const [onSaleNFTs, setOnSaleNFTs] = useState([]);

  async function loadOnSaleNFTs() {
    let data = await eventContractMarketInfura.fetchAllTokensOnSale();

    const tokenData = await Promise.all(
      data.map(async (index) => {
        //getting the TokenURI using the erc721uri method from our nft contract
        const tokenUri = await eventContractNFTInfura.tokenURI(index.tokenId);

        //getting the metadata of the nft using the URI
        const meta = await axios.get(tokenUri);

        let nftData = {
          tokenId: index.tokenId,
          price: ethers.utils.formatUnits(index.price.toString(), "ether"),
          onSale: index.onSale,
          owner: index.owner,
          seller: index.seller,
          minter: index.minter,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return nftData;
      })
    );
    setOnSaleNFTs(tokenData);
  }

  const [mintedNFTs, setMintedNFTs] = useState([]);

  async function loadMintedNFTs() {
    if (provider) {
      let data = await signerContractMarket.fetchTokensMintedByCaller();
      let tokenData = axiosGetTokenData(data);
      setMintedNFTs(tokenData);
    }
  }

  //uint256 _tokenId, address _nftContractAddress, value
  async function buyNFT(marketItem) {
    let id = marketItem.tokenId;
    id = id.toNumber();
    let price = marketItem.price;
    price = ethers.utils.parseEther(price);
    let tx = await signerContractMarket.buyMarketToken(
      id,
      ContractAddress[5].NFT,
      {
        value: price,
      }
    );

    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  async function sellNFT(marketItem) {
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      ContractAddress[5].NftMarketPlace,
      NftMarketPlace.abi,
      signer
    );
    const nftContract = new ethers.Contract(
      ContractAddress[5].NFT,
      NFT.abi,
      signer
    );
    let id = marketItem.tokenId;
    id = id.toNumber();
    await nftContract.setApprovalForAll(
      ContractAddress[5].NftMarketPlace,
      true
    );
    let tx = await contract.saleMarketToken(
      id,
      previewPriceTwo,
      ContractAddress[5].NFT
    );
    await tx.wait();
    loadOwnNFTs();
    loadOnSaleNFTs();
  }

  const [previewPriceTwo, setPreviewPriceTwo] = useState({});

  let previewPrice = 0;

  //BUG when using input field and using a nft button on a completely different nft its still submitting the input price
  //changing price from ether(user Input) into wei for contract
  const handleChangePrice = (e) => {
    previewPrice = e.target.value;
    // you need to use dots instead of commas when using ether instead of wei
    previewPrice = previewPrice.toString();
    previewPrice = ethers.utils.parseEther(previewPrice);
    setPreviewPriceTwo(previewPrice);
    console.log(previewPriceTwo);
  };

  const projectId = process.env.REACT_APP_PORJECT_ID_IPFS; // <---------- your Infura Project ID

  const projectSecret = process.env.REACT_APP_PORJECT_SECRET_IPFS; // <---------- your Infura Secret

  const projectIdAndSecret = `${projectId}:${projectSecret}`;

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        "base64"
      )}`,
    },
  });

  //keeping track of URL inserted as image for NFT metadata
  const [fileURL, setFileURL] = useState(null);
  const [formInput, setFormInput] = useState({ name: "", description: "" });

  async function handleUrlChange(e) {
    //check e.target.files without target [0]
    // console.log(e.target.files)
    const file = e.target.files[0];
    // console.log(file)
    try {
      const added = await client.add(
        file
        /*, {
                    progress: (prog) => console.log(`received ${prog}`)
                }*/
      );
      //added is an object containing the path(hash), CID, and the size of the file
      //console.log(added)
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      setFileURL(url);
      // console.log(url)
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  async function createMarket() {
    if (!formInput.name || !formInput.description || !fileURL) {
      return;
    }
    //upload to IPFS but this time with metadata
    //the metadata comes from a json, we need to stringify the data to upload it
    const data = JSON.stringify({
      name: formInput.name,
      description: formInput.description,
      image: fileURL,
    });

    try {
      const added = await client.add(data);
      const url = `https://biconomynft.infura-ipfs.io/ipfs/${added.path}`;
      //run a function that creates Sale and passes in the URL
      mintNFT(url);
    } catch (error) {
      console.log("Error uploading File:", error);
    }
  }

  //creating the NFT(first mint at ContractAddress[5].NftMarketPlace, second create market Token at market address)
  async function mintNFT(url) {
    //first step
    const signer = provider.getSigner();
    let contract = new ethers.Contract(ContractAddress[5].NFT, NFT.abi, signer);
    // let tx =
    await contract.createNFT(url);

    /* tx = await tx.wait();

     let event = tx.events[0];

    let value = event.args[2];
    //console.log(value)

     let tokenId = value.toNumber(); */

    //list the item for sale on marketplace
    let listingPrice = await eventContractMarket.getListingPrice();
    listingPrice = listingPrice.toString();
    /*listingPrice = listingPrice.toNumber()*/

    let transaction = await signerContractMarket.mintMarketToken(
      ContractAddress[5].NFT,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
  }

  function changeFormInputDescription(e) {
    setFormInput({ ...formInput, description: e.target.value });
  }
  function changeFormInputName(e) {
    setFormInput({ ...formInput, name: e.target.value });
  }

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header /* account={account} */ />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                account={account}
                networkChainId={network.chainId}
                networkName={network.name}
                handleUrlChange={handleUrlChange}
                mintNFT={mintNFT}
                onSaleNFTs={onSaleNFTs}
                buyNFT={buyNFT}
                FirstLoadGettingAccount={FirstLoadGettingAccount}
              />
            }
          />
          <Route
            exact
            path="/MintForm"
            element={
              <MintForm
                setFormInput={setFormInput}
                formInput={formInput}
                onChange={handleUrlChange}
                changeFormInputDescription={changeFormInputDescription}
                changeFormInputName={changeFormInputName}
                fileURL={fileURL}
                createMarket={createMarket}
              />
            }
          />
          <Route
            exact
            path="/OwnNfts"
            element={
              <OwnNfts
                ownNFTs={ownNFTs}
                sellNFT={sellNFT}
                handleChangePrice={handleChangePrice}
                loadOwnNFTs={loadOwnNFTs}
              />
            }
          />
          {/*deletingNFT={deletingNFT} */}
          <Route
            exact
            path="/MintedTokens"
            element={<MintedTokens mintedNFTs={mintedNFTs} />}
          />
          <Route
            exact
            path="/BiconomyCrossChain"
            element={<BiconomyCrossChain />}
          />
          <Route exact path="/TransakGateway" element={<TransakGateway />} />
          <Route
            exact
            path="/NftHistory"
            element={
              <NftHistory infuraProvider={infuraProvider} account={account} />
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
