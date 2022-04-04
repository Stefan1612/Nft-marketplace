import NET from "vanta/dist/vanta.net.min";
import { Box } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
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
    </Box>
  );
};

export default BackgroundImage;
