import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box } from "@mui/material";
const ArrowUp = () => {
  return (
    <Box
      sx={{
        color: "white",
        paddingLeft: "5px",
        marginTop: "6vh",
      }}
    >
      <ArrowUpwardIcon sx={{ fontSize: 60 }} />
      Check our Services!
    </Box>
  );
};

export default ArrowUp;
