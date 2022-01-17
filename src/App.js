
import './App.css';

import React, { useState, useEffect } from 'react';
import {Route,  Routes} from "react-router-dom"

//Components
import Navbar from "./Components/Navbar.js"
import Home from "./Components/Home.js"
import MintedTokens from "./Components/MintedTokens.js"
import MintForm from "./Components/MintForm.js"
import OwnNfts from "./Components/OwnNfts.js"

//abi's
import NFT from "./artifacts/contracts/NFT.sol/NFT.json";
import NftMarketPlace from "./artifacts/contracts/NftMarketPlace.sol/NftMarketPlace.json"

//others
import {ethers} from "ethers";
import axios from "axios"
import {create as ipfsHttpClient} from "ipfs-http-client"
import "bootstrap/dist/css/bootstrap.min.css"

//import {nftaddress, nftmarketaddress} from "../config"


const {utils, BigNumber} = require('ethers');

function App() {
    
    //contract addresses
    const nftmarketaddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44"
    const nftaddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"

    //handle State
    const [account, setAccount] = useState("")  
    const [nfts, setNfts] = useState([])

    //provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    //view Calls
    //market
    const eventContract = new ethers.Contract(nftmarketaddress, NftMarketPlace.abi, provider);
    //nft
    const eventContractNFT = new ethers.Contract(nftaddress, NFT.abi, provider);

    //signer calls
    //market
    const signerContract = new ethers.Contract(nftmarketaddress, NftMarketPlace.abi, signer);
    //NFT
    const signerContractNFT = new ethers.Contract(nftaddress, NFT.abi, signer);



    
    //side loaded
    useEffect(() =>{
        FirstLoadGettingAccount()
        gettingNetworkNameChainId()    
        loadAll() 
        loadOwnNFTs()
        loadMintedNFTs()
        loadOnSaleNFTs()
    },[])

    //side loaded
    async function FirstLoadGettingAccount(){
        if(typeof window.ethereum !== undefined){
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"}
            )
            setAccount(accounts[0])
        }
        else {
            window.alert("Install Metamask!")
        }
    }

    //on chain change
    useEffect(() =>{
        window.ethereum.on('chainChanged', handleChainChanged);
        return () => {
            window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
    },[])


    function handleChainChanged(_chainId) {
        // We recommend reloading the page, unless you must do otherwise
        window.location.reload();
    }

    //on account change
    useEffect(() =>{
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
    },[])

    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
        } else if (accounts[0] !== account) {
        setAccount(accounts[0])
        window.location.reload();;      

    } 
}
    //network
    const [network, setNetwork] = useState({
        chanId: "",
        name: ""
})
    async function gettingNetworkNameChainId(){
        const network = await provider.getNetwork()
        setNetwork(network)
}


    //Loading every NFT function
    //ADD ERROR OPTIONS TRY AND CATCH
    async function loadAll(){
        let data = await eventContract.fetchAllTokens();
        
        const tokenData = await Promise.all(data.map(async index => {
            //getting the TokenURI using the erc721uri method from our nft contract
            const tokenUri = await eventContractNFT.tokenURI(index.tokenId)
            
            //getting the metadata of the nft using the URI
            const meta = await axios.get(tokenUri)
           // console.log(meta)
            // DONT FORGET THIS
            //change the format to something im familiar with
            let nftData = {
                tokenId: index.tokenId,
                price: ethers.utils.formatUnits(index.price.toString(), "ether"),
                onSale: index.onSale,
                owner: index.owner,
                seller: index.seller,
                minter: index.minter,

                //adding .data to metadata to access image
                //checkout the metadata

                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description     
            }
            
            return nftData
        }))
        setNfts(tokenData)
        
       // console.log(nfts)
    }

    const [ownNFTs, setOwnNFTs] = useState([])

    async function loadOwnNFTs(){
        
        
        let data = await signerContract.fetchAllMyTokens()
        
        const tokenData = await Promise.all(data.map(async index => {
            //getting the TokenURI using the erc721uri method from our nft contract
            const tokenUri = await eventContractNFT.tokenURI(index.tokenId)
            
            //getting the metadata of the nft using the URI
            const meta = await axios.get(tokenUri)
          
            // DONT FORGET THIS
            //change the format to something im familiar with
            let nftData = {
                tokenId: index.tokenId,
                price: ethers.utils.formatUnits(index.price.toString(), "ether"),
                onSale: index.onSale,
                owner: index.owner,
                seller: index.seller,
                minter: index.minter,

                //adding .data to metadata to access image
                //checkout the metadata

                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description     
            }
            
            return nftData
        }))
        setOwnNFTs(tokenData)
    }

    const [onSaleNFTs, setOnSaleNFTs] = useState([])

    async function loadOnSaleNFTs(){
        
        
        let data = await signerContract.fetchAllTokensOnSale()
        
        const tokenData = await Promise.all(data.map(async index => {
            //getting the TokenURI using the erc721uri method from our nft contract
            const tokenUri = await eventContractNFT.tokenURI(index.tokenId)
            
            //getting the metadata of the nft using the URI
            const meta = await axios.get(tokenUri)
          
            // DONT FORGET THIS
            //change the format to something im familiar with
            let nftData = {
                tokenId: index.tokenId,
                price: ethers.utils.formatUnits(index.price.toString(), "ether"),
                onSale: index.onSale,
                owner: index.owner,
                seller: index.seller,
                minter: index.minter,

                //adding .data to metadata to access image
                //checkout the metadata

                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description     
            }
            
            return nftData
        }))
        setOnSaleNFTs(tokenData)
        
    }


    const [mintedNFTs, setMintedNFTs] = useState([])

    async function loadMintedNFTs(){             
        let data = await signerContract.fetchTokensMintedByCaller()
        
        const tokenData = await Promise.all(data.map(async index => {
            //getting the TokenURI using the erc721uri method from our nft contract
            const tokenUri = await eventContractNFT.tokenURI(index.tokenId)
            
            //getting the metadata of the nft using the URI
            const meta = await axios.get(tokenUri)
          
            // DONT FORGET THIS
            //change the format to something im familiar with
            let nftData = {
                tokenId: index.tokenId,
                price: ethers.utils.formatUnits(index.price.toString(), "ether"),
                onSale: index.onSale,
                owner: index.owner,
                seller: index.seller,
                minter: index.minter,

                //adding .data to metadata to access image
                //checkout the metadata

                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description     
            }
            
            return nftData
        }))
        setMintedNFTs(tokenData)
    }

    //uint256 _tokenId, address _nftContractAddress, value
    async function buyNFT(marketItem){
        let id= marketItem.tokenId               
        id = id.toNumber() 
        let price = marketItem.price     
        price = ethers.utils.parseEther(price)     
        let tx = await signerContract.buyMarketToken(id, nftaddress, {value: price})
        await tx.wait()
        loadOwnNFTs()
        loadOnSaleNFTs()
    }

    //BUG
    //looks like you can only after you minted a NFT
    async function sellNFT(marketItem){
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nftmarketaddress, NftMarketPlace.abi, signer);       
        let id= marketItem.tokenId        
        id = id.toNumber()       
        let tx = await contract.saleMarketToken(id, previewPriceTwo, nftaddress)
        await tx.wait()
        loadOwnNFTs()
        loadOnSaleNFTs()
    }
    
    const [previewPriceTwo, setPreviewPriceTwo] = useState({})

    let previewPrice = 0

    //BUG when using input field and using a nft button on a completely different nft its still submitting the input price
    //changing price from ether(user Input) into wei for contract
    const handleChangePrice = (e) => {
        previewPrice = e.target.value
        // you need to use dots instead of commas when using ether instead of wei
        previewPrice = previewPrice.toString()
        previewPrice = ethers.utils.parseEther(previewPrice)      
       setPreviewPriceTwo(previewPrice)
       console.log(previewPriceTwo)
    }

    //client used to host and upload data, endpoint infura
    //api
    const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0") 

    //keepin track of URL inserted as image for NFT metadata
    const [fileURL, setFileURL] = useState(null)
    const [formInput, setFormInput] = useState({ name: "", description: "", })

    async function handleUrlChange(e){
        //check e.target.files without target [0]
       // console.log(e.target.files)
        const file = (e.target.files[0]);
       // console.log(file)
        try {
            const added = await client.add(
                file
                /*, {
                    progress: (prog) => console.log(`received ${prog}`)
                }*/
            )
            //added is an object containing the path(hash), CID, and the size of the file
            //console.log(added)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileURL(url)
           // console.log(url)
        }
        catch (error){
            console.log("Error uploading File:", error)
        }
    }

    async function createMarket() {      
        if(!formInput.name || !formInput.description || !fileURL ){
            return
        }
        //upload to IPFS but this time with metadata
        //the metadata comes from a json, we need to stringify the data to upload it      
        const data = JSON.stringify({         
            name: formInput.name,
            description: formInput.description,
            image: fileURL
        })
        //console.log(data)
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            //run a function that creates Sale and passes in the URL
            mintNFT(url)
        }

        catch (error){
            console.log("Error uploading File:", error)
        }

    }

    

    
    //creating the NFT(first mint at nftAddress, second create market Token at market address)
    async function mintNFT(url){
        //first step
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);  
        let tx = await contract.createNFT(url);
        
        //this code might be unnecessary
        tx = await tx.wait()
     
        let event = tx.events[0]
          
        let value = event.args[2]
        //console.log(value)

        let tokenId = value.toNumber()
  
        //const price = ethers.utils.parseUnits(formInput.price, "ether")

        //list the item for sale on marketplace
        let listingPrice = await eventContract.getListingPrice()
        listingPrice = listingPrice.toString()
       /*listingPrice = listingPrice.toNumber()
        console.log(listingPrice)*/

        let transaction = await signerContract.mintMarketToken(nftaddress, {value: listingPrice})
        await transaction.wait()
    }


    //Bug
    //if the user accepts the first but cancels the second transaction the whole code will break
    //!Remove error message when mapping is looking at a deleted NFT!
    async function deletingNFT(marketItem){
        const signer = provider.getSigner()
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        
        let id= marketItem.tokenId        
        id = id.toNumber()  
        await contract.burn(id)
        

        contract = new ethers.Contract(nftmarketaddress, NftMarketPlace.abi, signer); 

        await contract.deleteNFT(id)
    }



    function changeFormInputDescription(e){

        setFormInput({...formInput, description: e.target.value})      
    }
    function changeFormInputName(e){
        setFormInput({...formInput, name: e.target.value})
    }

  return (
    <div className="App " id="co"> 
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
    
      <header className="App-header">
          
        <Navbar />
        </header>
        
       <div id="pages" > 
      
       <Routes >
          <Route exact path="/"  element={<Home  account={account} networkChainId={network.chainId} networkName={network.name} handleUrlChange={handleUrlChange} mintNFT={mintNFT} nfts={nfts} onSaleNFTs={onSaleNFTs} buyNFT={buyNFT}/>} />


          <Route exact path="/MintForm"  element={<MintForm setFormInput={setFormInput} formInput={formInput} onChange={handleUrlChange} changeFormInputDescription={changeFormInputDescription} changeFormInputName={changeFormInputName} fileURL={fileURL} createMarket={createMarket}/> } />

          <Route exact path="/OwnNfts"  element={<OwnNfts  ownNFTs={ownNFTs} sellNFT={sellNFT} handleChangePrice={handleChangePrice} deletingNFT={deletingNFT}/>} />

          <Route exact path="/MintedTokens"  element={<MintedTokens mintedNFTs={mintedNFTs}/>} />
        </Routes>
            </div>
        
      
      <footer id="footer">
      <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
      <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp;  </i> 
          <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
      </footer>
    </div>

  );
}

export default App;
