import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider, Zoom } from "@mui/material";
import theme from "./themes/ThemeMUI.ts";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router.tsx";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import store from "./store/index.tsx";
import { themeSnackbar } from "./themes/ThemeSnackbar.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={5}
          TransitionComponent={Zoom}
          Components={themeSnackbar}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
