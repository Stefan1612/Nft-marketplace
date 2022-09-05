import React from "react";
import { useState, useEffect } from "react";
import { Typography, Box, Button, Container } from "@mui/material";
import Footer from "../Footer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

/// Biconomy

import * as HyphenWidget from "@biconomy/hyphen-widget";
import "@biconomy/hyphen-widget/dist/index.css";

const CrossChainTransfer = (props) => {
  const [hyphenWidget, setHyphenWidget] = useState();

  useEffect(() => {
    const widget = HyphenWidget.default.init(
      document.getElementById("widget"),
      {
        tag: "expecto-patronum",
        showWidget: true,
        showCloseButton: true,
      }
    );

    if (widget) {
      setHyphenWidget(widget);
    }
  }, []);

  function handleOpen() {
    hyphenWidget.open();
  }

  function handleClose() {
    hyphenWidget.close();
  }

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
      <Box sx={{ color: "white" }}>
        <Typography paddingTop={"15vh"} sx={{ textAlign: "center" }}>
          Cross Chain Transfer
        </Typography>
      </Box>
      {/* <Button
        sx={{ backgroundColor: "red" }}
        onClick={() => props.setUpBiconomy()}
      >
        setUpBiconomy
      </Button> */}

      <Container>
        <Box paddingTop={"5vh"} marginBottom={"5vh"}>
          <Box id="pages" paddingBottom={"10vh"}>
            <form className="form-inline text-center">
              <i className="fas fa-cat"></i>
            </form>
            <Typography
              component={"h2"}
              variant={"h1"}
              align="center"
              color={"secondary"}
            >
              Cross Chain Transfer
            </Typography>

            <br></br>
            <div
              className="col-md-10 offset-md-1 d-flex justify-content-around"
              style={{ marginTop: "6vh" }}
            >
              <Container>
                <Box>
                  {" "}
                  <div class="widget-container">
                    <div id="widget"></div>
                  </div>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "white" }}
                    onClick={handleOpen}
                  >
                    Open Widget
                  </Button>
                  &nbsp; &nbsp;
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "white" }}
                    onClick={handleClose}
                  >
                    Close Widget
                  </Button>
                </Box>
              </Container>
            </div>
          </Box>
        </Box>

        <br></br>
        <br></br>
        <Footer />
      </Container>
    </Box>
  );
};

export default CrossChainTransfer;
