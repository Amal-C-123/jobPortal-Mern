import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthContext from "./Context/Global";
import { theme } from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <AuthContext>
      <App />
    </AuthContext>
  </ThemeProvider>
  // </React.StrictMode>
);
