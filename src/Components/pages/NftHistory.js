import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import axios from "axios";
import { ethers } from "ethers";
import NFT from "../config/contracts/NFT.json";
import ContractAddress from "../config/contracts/map.json";
const NftHistory = ({
  account,

  infuraProvider,
}) => {
  const [transferHistory, setTransferHistory] = useState("");
  const [transferArray, setTransferArray] = useState([]);
  async function getCovalentData() {
    const url = `https://api.covalenthq.com/v1/42/address/${account}/transfers_v2/?contract-address=${ContractAddress[42].NFT}&key=${process.env.REACT_APP_COVALENT_API_KEY}`;
    let result = await axios.get(url);
    setTransferHistory(result);
  }
  useEffect(() => {
    if (transferHistory) {
      setTransferArray(transferHistory.data.data.items);
      /* console.log("transfer Array updated to equal transferHistory"); */
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transferHistory]);

  function showNftTransactionType(index) {
    if (index.transfers[0].transfer_type === "IN") {
      console.log(index.to_address);
      let address = ContractAddress[42].NFT;
      console.log(ContractAddress[42].NFT);
      if (index.to_address === address.toLowerCase()) {
        return "Token Minted";
      }
      return "Token bought";
    }
    if (index.transfers[0].transfer_type === "OUT") {
      return "Token put up for sale";
    }
  }

  /*  const [transferData, setTransferData] = useState([]); */
  const [finishedFinalObject, setFinishedFinalObject] = useState(false);
  const [finalObject, setFinalObject] = useState([]);

  async function getData() {
    let memoryArray = [];
    transferArray.forEach((e) => {
      let result = showNftTransactionType(e);
      memoryArray.push({
        Interaction: result,
        TransferType: e.transfers[0].transfer_type,
        From: e.from_address,
        To: e.to_address,
        GasSpent: e.gas_spent,
        GasPrice: e.gas_price,
        TxHash: e.tx_hash,
        ContractName: e.transfers[0].contract_name,
        ContractTicker: e.transfers[0].contract_ticker_symbol,
      });
    });
    /* setTransferData(memoryArray); */
    // saves all transaction objects in order "newest -> oldest"

    const contractNFTInfura = new ethers.Contract(
      ContractAddress[42].NFT,
      NFT.abi,
      infuraProvider
    );

    await Promise.all(
      memoryArray.map(async (e, i) => {
        const receipt = await infuraProvider.getTransactionReceipt(e.TxHash);

        let tokenId = receipt.logs[0].topics[3];

        tokenId = tokenId.slice(2);
        tokenId = parseInt(tokenId, 16);

        let tokenUri = await contractNFTInfura.tokenURI(tokenId);

        const meta = await axios.get(tokenUri);

        e.image = meta.data.image;
      })
    );
    setFinalObject(memoryArray);
    setFinishedFinalObject(true);
  }

  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Container>
        <Box
          sx={{
            color: "white",
            borderColor: "white",
            border: "solid",
            borderWidth: "1px",
            marginBottom: "2vh",
          }}
        >
          {" "}
          <Box>
            Currently Connected With: {account ? account : "Not Connected"}
          </Box>
          {/*  Current Ethereum Balance: */}
        </Box>{" "}
        <Box
          style={{
            border: "solid",
            /* margin: "10px", */
            padding: "10px",
            paddingLeft: "30px",
            borderWidth: "1px",
            textAlign: "left",
            backgroundColor: "white",
          }}
        >
          {" "}
          <Typography variant={"h3"} sx={{ color: "black" }}>
            Transfers
          </Typography>
        </Box>
        {/* <Button onClick={(e) => getCovalentBalance()}>Get balance</Button> */}
        <Box
          sx={{ textAlign: "center", marginTop: "100px", marginBottom: "20px" }}
        >
          <Box sx={{ color: "white" }}>
            <Typography variant={"h5"} component={"p"}>
              Double Tap
            </Typography>
          </Box>
          <Button onClick={(e) => getCovalentData()} variant="contained">
            Generate Transaction History
          </Button>
        </Box>
        <Box>
          {finishedFinalObject &&
            finalObject.map((e, index) => {
              return (
                <Box
                  key={index}
                  style={{
                    border: "solid",
                    margin: "10px",
                    padding: "10px",
                    paddingLeft: "30px",
                    borderWidth: "1px",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  <Box>
                    <Box style={{ float: "left", paddingRight: "40px" }}>
                      <Box>
                        <Typography variant={"h6"}> {e.Interaction}</Typography>
                      </Box>
                      <Box>From =&gt; {e.From}</Box>
                      <Box>To =&gt; {e.To}</Box>
                      <Box>Gas spent =&gt; {e.GasSpent}</Box>
                      <Box>Gas price =&gt; {e.GasPrice}</Box>
                      <Box>Tx Hash =&gt; {e.TxHash}</Box>
                      <Box>Transfer Type =&gt; {e.TransferType}</Box>
                      <Box>Contract Name =&gt; {e.ContractName}</Box>
                      <Box>Contract Ticker =&gt; {e.ContractTicker}</Box>
                    </Box>
                    <img
                      src={e.image}
                      alt="nft"
                      style={{ width: "250px" }}
                    ></img>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Container>
    </Box>
  );
};

export default NftHistory;
