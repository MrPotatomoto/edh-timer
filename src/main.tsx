import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import App from "./App";
import "./index.css";

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Set default to dark mode
    useSystemColorMode: false, // Disable system color mode override
  },
  colors: {
    brand: {
      50: "#f7edfd",
      100: "#decee6",
      200: "#c6aed1",
      300: "#ae8fbd",
      400: "#976fa9",
      500: "#7e5690",
      600: "#624371",
      700: "#472f51",
      800: "#2b1c33",
      900: "#120717",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
