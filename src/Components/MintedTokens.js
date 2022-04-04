import { Typography, Box, Paper, Grid, Container } from "@mui/material";
import Footer from "./Footer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const MintedTokens = (props) => {
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
              NFT's you have minted!
            </Typography>
            {props.mintedNFTs.length === 0 && (
              <h1 className="text-center " style={{ marginTop: "4vh" }}>
                You have not minted any NFTs yet!
              </h1>
            )}

            <div
              className="col-md-10 offset-md-1 "
              style={{ marginTop: "6vh" }}
            >
              <Container>
                <Box>
                  <Grid container spacing={4}>
                    {props.mintedNFTs.map((index) => {
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

export default MintedTokens;
