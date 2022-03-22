import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Container,
  Item,
  Input,
  TextField,
} from "@mui/material";
import BackgroundImageTwo from "./BackgroundImageTwo";
const MintForm = (props) => {
  return (
    <Box style={{ paddingTop: "15vh", height: "65vh" }}>
      <Box className="d-flex">
        <BackgroundImageTwo />
      </Box>
      {/*   <Box
        backgroundColor={"#212121"}
        marginLeft={"20vw"}
        padding={"15px"}
        borderRadius={"15px"}
        color={"white"}
        // marginRight={"57vw"} 
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              Component={"h1"}
              variant={"h1"}
              color={"primary"}
              fontSize={"calc(1.5vw + 1.5vh)"}
            >
              Fill in the Form to mint a new NFT
            </Typography>
            <Typography Component={"h3"} variant={"h3"} color={"white"}>
              (You must fill out every input field)
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography Component={"body2"} variant={"h3"}>
              Name:{" "}
            </Typography>
            <TextField
              placeholder="Name max 14 letters"
              type="text"
              maxLength="14"
              onChange={(e) => props.changeFormInputName(e)}
              variant={"filled"}
            />
          </Grid>

          <Grid item xs={7}>
            <Typography Component={"body2"} variant={"h3"}>
              Description:
            </Typography>

            <TextField
              variant={"filled"}
              placeholder="Description max 30 letters"
              type="text"
              maxLength="30"
              onChange={(e) => props.changeFormInputDescription(e)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Choose the File to upload as NFT</Typography>

            <Input type="file" name="Asset" onChange={props.onChange} />
          </Grid>
          <Grid item xs={6}>
            <Button variant={"contained"} onClick={props.createMarket}>
              Mint NFT
            </Button>
          </Grid>
          <Grid item xs={6}>
            {props.fileURL && (
              <Box style={{ marginLeft: "5px", height: "43vh" }}>
                <img alt="NFT" src={props.fileURL}></img>
                <Box>
                  <Typography>"Name of NFT"</Typography>
                  <Typography>"Description of NFT"</Typography>
                  <Typography>"Price in Ether"</Typography>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box> */}
      <div className=" d-flex justify-content-around" style={{}}>
        <div
          style={{
            backgroundColor: "#212121",
            marginLeft: "15vw",
            padding: "15px",
            borderRadius: "15px",
            color: "white",
          }}
          className="col-md-3 "
        >
          <Typography
            component={"h1"}
            variant={"h1"}
            color={"primary"}
            fontSize={"calc(1.5vw + 1.5vh)"}
          >
            Fill in the Form to mint a new NFT
          </Typography>
          <Typography component={"h3"} variant={"h3"} color={"white"}>
            (You must fill out every input field)
          </Typography>
          <div>
            <Typography component={"p"} variant={"h3"}>
              Name:{" "}
            </Typography>
            <TextField
              placeholder="Name max 14 letters"
              type="text"
              maxLength="14"
              onChange={(e) => props.changeFormInputName(e)}
              variant={"filled"}
            />
            <Typography component={"p"} variant={"h3"}>
              Description:
            </Typography>
            <TextField
              variant={"filled"}
              placeholder="Description max 30 letters"
              type="text"
              maxLength="30"
              onChange={(e) => props.changeFormInputDescription(e)}
            />
            <Typography>Choose the File to upload as NFT</Typography>

            <Input type="file" name="Asset" onChange={props.onChange} />
            <Button variant={"contained"} onClick={props.createMarket}>
              Mint NFT
            </Button>
          </div>
        </div>

        {props.fileURL && (
          <Box>
            <Paper elevation={24}>
              <Box padding={1.5}>
                <img
                  width={"258vw"}
                  height={"258vh"}
                  alt="NFT"
                  src={props.fileURL}
                ></img>
                <div>
                  <Typography component={"p"} variant={"h2"}>
                    NFT Name
                  </Typography>
                  <Typography
                    paddingBottom={"6vh"}
                    variant={"body2"}
                    component={"p"}
                  >
                    NFT Description
                  </Typography>
                  <Typography component={"p"} variant={"h3"}>
                    Price in Ether
                  </Typography>
                  <Typography style={{ color: "white" }}>
                    Current Seller: &nbsp;
                    {/*  {index.owner.substring(0, 5) +
                                  "..." +
                                  index.owner.substring(38)} */}
                  </Typography>
                  <Button
                    variant={"outlined"}

                    /*  onClick={() => props.buyNFT(index)} */
                  >
                    Buy NFT
                  </Button>
                </div>
              </Box>
            </Paper>
          </Box>
        )}

        <br></br>
      </div>
    </Box>
  );
};

export default MintForm;
