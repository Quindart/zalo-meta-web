import { createTheme } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "#0068FF",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          textTransform: "none",
        }),
        contained: () => ({
          color: "white",
        }),

        sizeSmall: () => ({
          fontSize: 12,
          height: 35,
        }),
        sizeMedium: () => ({
          fontSize: 12,
        }),
        sizeLarge: () => ({
          fontSize: 12,
        }),
      },
    },
  },
  spacing: 8,
});

export default theme;
