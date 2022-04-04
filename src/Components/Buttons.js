import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
const Buttons = (props) => {
  return (
    <Box
      sx={{
        top: "35vh",
        left: "25vw",

        zIndex: 1,
        position: "absolute",
      }}
    >
      <Button variant="contained">
        <Link
          to="/MintForm"
          className="Nav"
          style={{ textDecoration: "none", color: "white" }}
        >
          Mint NFT
        </Link>
      </Button>
      <Button
        variant="outlined"
        sx={{ marginLeft: "5px" }}
        onClick={(e) => props.FirstLoadGettingAccount()}
      >
        Metamask
      </Button>
    </Box>
  );
};

export default Buttons;
