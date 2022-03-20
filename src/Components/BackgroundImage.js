import NET from "vanta/dist/vanta.net.min";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
const BackgroundImage = () => {
  const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: myRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xddb1f0,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <Box
      sx={{
        minHeight: "100%",
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
        position: "absolute",
      }}
      ref={myRef}
    >
      <Box sx={{ marginLeft: "25vw", color: "white" }}>
        <Typography marginTop={28} component="h1" variant="h1">
          NFT Marketplace
        </Typography>
        <Typography marginTop={2} component="h2" variant="h2">
          Running on Rinkeby!
        </Typography>
      </Box>
    </Box>
  );
};

export default BackgroundImage;
