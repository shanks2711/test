import React, { useEffect, useState } from "react";
import "./styles/App.css";
import polygonLogo from "./assets/polygonlogo.png";
import ethLogo from "./assets/ethlogo.png";
import { networks } from "./utils/networks";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useNavigate } from "react-router-dom";
import Mints from "./components/mints";
import MyDomains from "./components/myDomains";
import ConnectWallet from "./components/walletConnect/ConnectWallet";
import WalletInfo from "./components/walletConnect/WalletInfo";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./components/walletConnect/Connector";
import { isMobile } from "react-device-detect";
import Drawer from "./components/Drawer";

// Add the domain you will be minting

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  // Add some state data propertie
  const [network, setNetwork] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();

  const [openWallets, setOpenWallets] = useState(false);
  const { activate, active, account } = useWeb3React();

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          //
          await activate(injected);
        } catch (ex) {}
      }
    };
    connectWalletOnPageLoad();
  }, [activate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (account && active) {
      localStorage.setItem("isWalletConnected", true);
      setOpenWallets(false);
    } else {
      localStorage.setItem("isWalletConnected", false);
    }
  }, [active, account]);

  const connectWallet = () => {
    setOpenWallets(true);
  };

  const handleClose = () => {
    setOpenWallets(false);
  };

  // const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Get MetaMask -> https://metamask.io/");
  //       return;
  //     }

  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //
  //     setCurrentAccount(accounts[0]);
  //   } catch (error) {
  //
  //   }
  // };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      return;
    } else {
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      //
      setCurrentAccount(account);
    } else {
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("actives");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {openWallets && <ConnectWallet handleClose={handleClose} />}
      <div
        className="overlay"
        style={{ display: showLoader ? "block" : "none" }}
      >
        <div className="overlay__inner">
          <div className="overlay__content">
            <span className="spinner"></span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="header-container">
          <header>
            <div
              className="left"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="logo"
                width="180"
                height="50"
              />
            </div>
            {isMobile ? (
              <Drawer />
            ) : (
              <div className="navbar">
                <div className="subnav active">
                  <button className="subnavbtn" onClick={() => navigate("/")}>
                    Domains
                  </button>
                  <div className="subnav-content">
                    <a href="#company" className="active">
                      Domain Search
                    </a>
                    <a href="#team">Premium Domains</a>
                    <a href="#careers">Refere Friends</a>
                    <a href="#mydomains">My Domains</a>
                  </div>
                </div>
                <div className="subnav">
                  <button className="subnavbtn">
                    Learn <i className="fa fa-caret-down"></i>
                  </button>
                  <div className="subnav-content">
                    <a href="#bring">Learning Hub</a>
                    <a href="#deliver">About</a>
                  </div>
                </div>
                <div className="subnav">
                  <button className="subnavbtn">
                    Build <i className="fa fa-caret-down"></i>
                  </button>
                  <div className="subnav-content">
                    <a href="#link1">Developers</a>
                    <a href="#link2">Discord</a>
                    <a href="#link3">Documentation</a>
                  </div>
                </div>
                <div className="subnav">
                  <button className="subnavbtn">
                    Apps <i className="fa fa-caret-down"></i>
                  </button>
                </div>
              </div>
            )}
            {/* Display a logo and wallet connection status*/}

            <div className="right">
              <>
                <img
                  alt="Network logo"
                  className="logo"
                  src={
                    network && network.includes("Polygon")
                      ? polygonLogo
                      : ethLogo
                  }
                />
                {account ? (
                  <WalletInfo />
                ) : (
                  <p
                    style={{ color: "#fff", cursor: "pointer" }}
                    onClick={connectWallet}
                  >
                    {" "}
                    Connect{" "}
                  </p>
                )}
              </>
            </div>
            {currentAccount && (
              <div className="dropdown user-drop">
                <img
                  src={`${process.env.PUBLIC_URL}/user.png`}
                  alt="logo"
                  width="50"
                  height="50"
                  className="dropbtn"
                />
                <div className="dropdown-content">
                  <div
                    onClick={() => navigate("/my-domains")}
                    className="user-profile"
                  >
                    My Domains
                  </div>
                </div>
              </div>
            )}
          </header>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Mints
                network={network}
                currentAccount={currentAccount}
                setShowLoader={setShowLoader}
                connectWallet={connectWallet}
              />
            }
          />
          <Route
            path="/my-domains"
            element={
              <MyDomains
                network={network}
                currentAccount={currentAccount}
                setShowLoader={setShowLoader}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
