import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#4b77d1' }, 
    },
    components: {
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
        },
      },
    },
  },
  ruRU,
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
     <ThemeProvider theme={theme}> 
        <App />
      </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();
