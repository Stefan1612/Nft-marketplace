import { createTheme } from "@mui/material";

const basicTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ddb1f0",
    },
    secondary: {
      main: "#212121",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Verdana",
      "BlinkMacSystemFont",
      "-apple-system",
    ].join(","),
    h1: {
      lineHeight: "122.19%",
      fontSize: 48,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    h2: {
      fontSize: 28,
      fontWeight: "700",
    },
    h3: {
      fontSize: 22,
      color: "#ddb1f0",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        sizeMedium: {
          fontSize: 24,
        },
        sizeLarge: {
          fontSize: 27,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 700,
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%",
        },
        body: {
          // color: "rgba(255, 255, 255, 0.932)",
          backgroundColor: "#131318",
          paddingTop: 16,
          paddingBottom: 16,
          minWidth: 320,
          minHeight: "100%",
        },
        code: {
          padding: ".2em .4em",
          margin: 0,
          fontSize: "85%",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderRadius: 8,
        },
      },
    },
  },
});

export default basicTheme;
