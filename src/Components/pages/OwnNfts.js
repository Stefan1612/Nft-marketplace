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
              <Box sx={{ textAlign: "center" }}>
                <Typography variant={"h2"} component={"h2"}>
                  Wrong network
                </Typography>
                <Button
                  variant={"outlined"}
                  onClick={(e) => props.changeNetworkToGoerli(e)}
                >
                  Connect to Goerli!
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant={"h2"} component={"h2"}>
                  Connected to Goerli
                </Typography>
              </Box>
              /*  props.ownNFTs.length === 0 && (
                <h1 className="text-center " style={{ marginTop: "4vh" }}>
                  You don't own any NFTs currently!
                </h1>
              ) */
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
            </div>
          </Box>
        </Box>
        <Footer />
      </Container>
    </Box>
  );
};

export default OwnNfts;
