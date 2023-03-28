import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import getLibrary from "./components/walletConnect/getLibrary";
import { Web3ReactProvider } from "@web3-react/core";
import Web3ProviderNetwork from "./components/walletConnect/Web3ProviderNetwork";
import MyDomains from "./components/myDomains";
import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<App />} />
            <Route exact path="/my-domains" element={<MyDomains />} />
          </Routes>
        </BrowserRouter>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
