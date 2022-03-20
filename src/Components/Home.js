import { Typography, Box, Button, Paper, Grid, Container } from "@mui/material";
import BackgroundImage from "./BackgroundImage";
import NFTCard from "./NFTCard";
const Home = (props) => {
  return (
    <Box>
      <BackgroundImage />
      <Box paddingBottom={"10vh"} />
      <Box id="pages">
        <form className="form-inline text-center">
          <i className="fas fa-cat"></i>
        </form>
        <br></br>
        {props.onSaleNFTs.length === 0 && (
          <h1 className="text-center " style={{ marginTop: "4vh" }}>
            There are currently no Tokens up for sale
          </h1>
        )}
        <br></br>
        <div
          className="col-md-10 offset-md-1 d-flex justify-content-around"
          style={{ marginTop: "6vh" }}
        >
          <Container>
            <Box>
              <Grid container spacing={4}>
                {props.onSaleNFTs.map((index) => {
                  return (
                    /*  <Box key={index.tokenId}>
                <Container sx={{ marginY: 5 }}>
                  <Grid container spacing={4}>
                    <NFTCard
                      handleUrlChange={props.handleUrlChange}
                      mintNFT={props.mintNFT}
                      nfts={props.nfts}
                      onSaleNFTs={props.onSaleNFTs}
                      buyNFT={props.buyNFT}
                      index={index}
                    />
                  </Grid>
                </Container>
              </Box> */

                    <Grid item xs={4} key={index.tokenId}>
                      <Paper elevation={24}>
                        <Box padding={1.5}>
                          <img
                            width={"260vw"}
                            height={"260vh"}
                            alt="NFT"
                            src={index.image}
                          ></img>

                          <Typography>{index.name}</Typography>
                          <Typography paddingBottom={"6vh"}>
                            {index.description}
                          </Typography>
                          <Typography>{index.price} Ether</Typography>
                          <button
                            className="btn btn-success"
                            id="nftBuy"
                            onClick={() => props.buyNFT(index)}
                          >
                            Buy NFT
                          </button>
                          <Typography style={{ color: "white" }}>
                            Connected with: &nbsp;
                            {props.account.substring(0, 5) +
                              "..." +
                              props.account.substring(38)}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    /* <div
                key={index.tokenId}
                className="card col-md-2 tokenCard"
                style={{
                  marginLeft: "5px",
                  height: "46vh",
                  backgroundColor: "#212121",
                }}
              >
                <img
                  alt="NFT"
                  src={index.image}
                  className=" card-img-top imageId"
                ></img>

                <div className="card-body">
                  <div className="card-title" id="nftName">
                    {index.name}
                  </div>
                  <div className="card-text" id="nftDescription">
                    {index.description}
                  </div>
                  <div id="nftPrice">{index.price} Ether</div>
                  <button
                    className="btn btn-success"
                    id="nftBuy"
                    onClick={() => props.buyNFT(index)}
                  >
                    Buy NFT
                  </button>
                </div>
              </div> */
                  );
                })}
              </Grid>
            </Box>
          </Container>
        </div>

        <div></div>
      </Box>
    </Box>
  );
};

export default Home;
