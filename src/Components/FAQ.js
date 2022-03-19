import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
export default function SimpleAccordion() {
  return (
    <div style={{ marginTop: "5vh", marginBottom: "6vh" }}>
      <Box marginBottom={"2vh"}>
        <Typography variant={"h3"} component={"h3"}>
          FAQ section
        </Typography>
      </Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography>What are the minting fees?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Minting an NFT cost 0.002 ether</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Are there any purchase/selling fees?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>No, currently there are only fees for minting</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Why can't I see my other NFT's?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            This NFT market only shows you the NFT's which you have minted
            within this market
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography>
            Can other Markets like Opensea, see the NFT's minted within this
            market?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, every NFT minted on this market will also be visible on other
            NFT markets if they decide to do so (Opensea shows all NFT's as
            default)
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>Where do the NFT's get stored?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The tokenURL gets stored on-Chain and the the metadata including the
            image itself, get stored off-Chain on IPFS.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
