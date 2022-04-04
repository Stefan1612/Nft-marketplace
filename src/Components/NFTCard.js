import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
/* import Typography from "@mui/material/Typography";
import { AccessTime } from "@mui/icons-material";
import Rating from "@mui/material/Rating";
import { createTheme, ThemeProvider } from "@mui/material"; */

const TourCard = (props) => {
  return (
    <Grid item xs={3}>
      <Paper
        elevation={24}
        variant="outlined"
        sx={{ backgroundColor: "#212121" }}
      >
        <Box
          key={props.index.tokenId}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 128,
              height: 128,
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Paper elevation={24} width={"100%"}>
                <Box padding={1.5}>
                  {
                    // <img alt="NFT" src={index.image}></img>
                  }
                  <div className="card-title" id="nftName">
                    {props.index.name}
                  </div>
                  <div className="card-text" id="nftDescription">
                    {props.index.description}
                  </div>
                  <div id="nftPrice">{props.index.price} Ether</div>
                  <button
                    className="btn btn-success"
                    id="nftBuy"
                    onClick={() => props.buyNFT(props.index)}
                  >
                    Buy NFT
                  </button>
                  {/* <Typography style={{ color: "white" }}>
                            Connected with: &nbsp;
                            {props.account.substring(0, 5) +
                              "..." +
                              props.account.substring(38)}
                          </Typography> */}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TourCard;
