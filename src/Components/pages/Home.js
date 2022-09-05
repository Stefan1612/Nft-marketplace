import { Typography, Box, Button, Paper, Grid, Container } from "@mui/material";
import BackgroundImage from "../BackgroundImage";
import FAQ from "../FAQ";
import Footer from "../Footer";
import Buttons from "../Buttons";

const Home = (props) => {
  const showButton = true;
  return (
    <Box id="background" marginTop={"91vh"} sx={{ backgroundColor: "#212121" }}>
      <Container>
        <Box>
          <Buttons
            FirstLoadGettingAccount={props.FirstLoadGettingAccount}
            showButton={showButton}
          />
          <BackgroundImage />

          <Box paddingBottom={"10vh"} />
          <Box id="pages" paddingBottom={"10vh"}>
            <form className="form-inline text-center">
              <i className="fas fa-cat"></i>
            </form>
            <Typography
              Component={"h2"}
              variant={"h1"}
              align="center"
              color={"secondary"}
            >
              NFT's for sale
            </Typography>

            {props.onSaleNFTs.length === 0 && (
              <h1 className="text-center " style={{ marginTop: "4vh" }}>
                There are currently no Tokens up for sale
              </h1>
            )}
            <br></br>
            <div
              className="col-md-10 offset-md-1 "
              style={{ marginTop: "6vh" }}
            >
              <Container>
                <Box>
                  <Grid container spacing={4}>
                    {props.onSaleNFTs.map((index) => {
                      return (
                        <Grid item xs={4} key={index.tokenId}>
                          <Paper elevation={24}>
                            <Box padding={1.5}>
                              <img
                                width={"258vw"}
                                height={"258vh"}
                                alt="NFT"
                                src={index.image}
                              ></img>

                              <Typography component={"p"} variant={"h2"}>
                                {index.name}
                              </Typography>
                              <Typography
                                paddingBottom={"6vh"}
                                variant={"body2"}
                                component={"p"}
                              >
                                {index.description}
                              </Typography>

                              <Typography component={"p"} variant={"h3"}>
                                {index.price} Ether
                              </Typography>
                              <Typography style={{ color: "white" }}>
                                Current Seller: &nbsp;
                                {index.owner.substring(0, 5) +
                                  "..." +
                                  index.owner.substring(38)}
                              </Typography>
                              <Button
                                variant={"outlined"}
                                onClick={() => props.buyNFT(index)}
                              >
                                Buy NFT
                              </Button>
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
          </Box>
          <FAQ></FAQ>
          <Footer />
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
