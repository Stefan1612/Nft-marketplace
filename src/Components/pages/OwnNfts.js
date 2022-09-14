import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Container,
  Input,
} from "@mui/material";
import Footer from "../Footer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const OwnNfts = (props) => {
  return (
    <Box
      id="background"
      sx={{ backgroundColor: "#212121", minHeight: "100vh" }}
    >
      <Box
        sx={{
          color: "white",
          paddingLeft: "5px",
        }}
      >
        <ArrowUpwardIcon sx={{ fontSize: 60 }} />
        Check our Services!
      </Box>
      <Container>
        <Box paddingTop={"20vh"} marginBottom={"5vh"}>
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
              NFT's that you currently own!
            </Typography>
            {props.network.chainId !== 5 ? (
              <h1>wrong network</h1>
            ) : (
              <h1>Right network</h1>
            )}
            {props.ownNFTs.length === 0 && (
              <h1 className="text-center " style={{ marginTop: "4vh" }}>
                You don't own any NFTs currently!
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
                    {props.ownNFTs.map((index) => {
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
                              <Input
                                onChange={(e) => props.handleChangePrice(e)}
                                placeholder="Put in Sale price"
                              ></Input>
                              <Button
                                variant={"outlined"}
                                onClick={() => props.sellNFT(index)}
                              >
                                Sell
                              </Button>
                              <Button
                                variant={"contained"}
                                onClick={() => props.deletingNFT(index)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Container>
              {/*  {props.ownNFTs.map((index) => {
          return (
            <div
              key={index.tokenId}
              className="card col-md-2 tokenCard"
              style={{ marginLeft: "5px", height: "50vh" }}
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

                <input
                  style={{ width: "100%" }}
                  onChange={(e) => props.handleChangePrice(e)}
                  placeholder="Put in Sale price"
                ></input>
                <button
                  className="btn-success"
                  style={{ width: "45%" }}
                  id="nftBuy"
                  onClick={() => props.sellNFT(index)}
                >
                  Sell NFT
                </button>
                <button
                  className="btn-danger"
                  style={{ width: "55%" }}
                  id="nftBuy"
                  onClick={() => props.deletingNFT(index)}
                >
                  Delete NFT
                </button>
              </div>
            </div>
          );
        })} */}
            </div>
          </Box>
        </Box>
        <Footer />
      </Container>
    </Box>
  );
};

export default OwnNfts;
