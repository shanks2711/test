import React, { useEffect, useState } from "react";
import { domains, ENS_CONTRACT } from "../constants";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import ENSabi from "../components/ABI/ENSNamingABI.json";
import ressolverABI from "../components/ABI/ressolverABI.json";
import { Dialog } from "@mui/material";
import { injected } from "./walletConnect/Connector";
import "../styles/App.css";
import { ToastContainer } from "react-toastify";
import ConnectWallet from "./walletConnect/ConnectWallet";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Drawer from "./Drawer";
import polygonLogo from "../assets/polygonlogo.png";
import ethLogo from "../assets/ethlogo.png";
import WalletInfo from "./walletConnect/WalletInfo";
import { networks } from "../utils/networks";

const MyDomains = (props) => {
  const [preNode, setPreNode] = useState([]);
  const { account, library, activate } = useWeb3React();
  const [currentDomain, setCurrentDomain] = useState("");
  const [defaultDomain, setDefaultDomain] = useState("");
  const [open, setOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [openWallets, setOpenWallets] = useState(false);
  const navigate = useNavigate();
  const [network, setNetwork] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const lib = library;
  const web3 = new Web3(lib?.provider);

  const defaultNode = async () => {
    setShowLoader(true);
    let data;
    const userwalletaddresss = account;
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .defaultNode(userwalletaddresss)
      .call({ from: userwalletaddresss })
      .then(async (res) => {
        await instance.methods
          .resolver(res)
          .call({ from: userwalletaddresss })
          .then(async (res) => {
            data = await getNameByAddress(res);
            setDefaultDomain(data);
          })
          .catch((err) => {});
        setShowLoader(false);
      })
      .catch((err) => {
        setShowLoader(false);
      });
  };

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

  const getNameByAddress = async (address) => {
    let name;
    const userwalletaddresss = account;
    const instance = new web3.eth.Contract(ressolverABI, address);
    await instance.methods
      .getName(userwalletaddresss)
      .call({ from: userwalletaddresss })
      .then((res) => {
        // alert(res+" by address")
        name = res;
      })
      .catch((err) => {});
    return name;
  };

  const getResolver = async (preNode) => {
    let address;
    const userwalletaddresss = account;
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .resolver(preNode)
      .call({ from: userwalletaddresss })
      .then((res) => {
        address = res;

        // setRessolverAddress(res)
      })
      .catch((err) => {
        address = null;
      });

    return address;
    //
    // }).catch((err) => {
    //
    // })
  };

  const getNodeByAddress = async (acc) => {
    const userwalletaddresss = acc;
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .nodeAddress()
      .call({ from: userwalletaddresss })
      .then((res) => {
        let arr = res;
        arr.forEach(async (x) => {
          const address = await getResolver(x);
          const name = await getNameByAddress(address);

          // list.push(name)
          setPreNode((pre) => [...pre, name]);
        });
      })
      .catch((err) => {});
  };

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
    if (account) {
      // fetchMyDomains();
      getNodeByAddress(account);
      defaultNode();
    }
  }, [account]); // eslint-disable-line react-hooks/exhaustive-deps

  // const fetchMyDomains = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       // You know all this
  //       let mydomains = [];
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       props.setShowLoader(true);
  //       for (let i = 0; i < domains.length; i++) {
  //         const contract = new ethers.Contract(
  //           domains[i].address,
  //           contractAbi.abi,
  //           signer
  //         );

  //         // Get all the domain names from our contract
  //         const names = await contract.getAllNames();
  //
  //         // For each name, get the record and the address
  //         const mintRecords = await Promise.all(
  //           names.map(async (name) => {
  //             const mintRecord = await contract.records(name);
  //             const owner = await contract.domains(name);
  //             return {
  //               id: names.indexOf(name),
  //               name: name,
  //               record: mintRecord,
  //               owner: owner,
  //               addr: domains[i].address
  //             };
  //           })
  //         );
  //
  //         let filteredDomains = mintRecords.filter(
  //           (record) =>
  //             record.owner.toLowerCase() === props.currentAccount.toLowerCase()
  //         );
  //         mydomains = [...mydomains, ...filteredDomains];
  //
  //       }
  //       // setMyDomains(mydomains);
  //       props.setShowLoader(false);
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong!", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     props.setShowLoader(false);
  //     // setMyDomains([]);
  //   }
  // };

  const handleClose = () => {
    setOpen(false);
  };
  const setDefaultNode = async () => {
    setShowLoader(true);
    let userwalletaddresss = account;
    const node = web3.utils.sha3(currentDomain);
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .setDefaultNode(node)
      .send({ from: userwalletaddresss })
      .then((res) => {
        // getNodeByAddress(userwalletaddresss)
        window.location.reload();
      })
      .catch((err) => {
        setShowLoader(false);
      });
  };

  const connectWallet = () => {
    setOpenWallets(true);
  };

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
                src={`${process.env.PUBLIC_URL}/minLOGO2.jpeg`}
                alt="logo"
                width={isMobile ? "100" : "180"}
                height="50"
                style={{ borderRadius: "8px" }}
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

        <div className="domain-filters">
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
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ borderRadius: "10px" }}
          >
            <div style={{ margin: "20px" }}>
              <h2>you want to make it default domain {currentDomain}</h2>
              <div className="popupButton">
                <button
                  className="cta-button mint-button"
                  onClick={() => setDefaultNode()}
                >
                  Yes
                </button>
                <button
                  className="cta-button mint-button"
                  onClick={() => handleClose()}
                >
                  No
                </button>
              </div>
            </div>
          </Dialog>
          <h1 className="my-d-head">My Domains</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 30,
              borderRadius: 8,
              padding: "13px 16px 13px 8px",
              boxShadow: "inset 0 0 0 1px #e2e4ec",
              color: "#616161",
            }}
          >
            <div>
              <label htmlFor="tlds">Ending:</label>
              <select name="tlds" id="tlds">
                <option value="all">All</option>
                {domains.map((dom, index) => (
                  <option value={dom.tld} key={dom.tld}>
                    .{dom.tld}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sortby">Sort by:</label>
              <select name="sortby" id="sortby">
                <option value="name">Name</option>
                <option value="length">Length</option>
              </select>
            </div>
            <div>
              <label htmlFor="status">Status:</label>
              <select name="status" id="status">
                <option value="all">All</option>
                <option value="minted">Minted</option>
                <option value="notminted">Not Minted</option>
                <option value="pending">Pending Minting</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 10 }} className="my-domains">
            <ul>
              {preNode.map((dom, index) => (
                <li key={dom}>
                  <span>{dom}</span>{" "}
                  {dom === defaultDomain ? <sup>(default)</sup> : null}
                  {/* <a
                rel="noreferrer"
                href={`https://testnets.opensea.io/assets/mumbai/${dom.addr}/${dom.id}`}
                target="_blank"
                style={{ cursor: "pointer" }}
              > */}
                  <button
                    className="find-btn sell-btn fl-right"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      margin: "0 4px",
                    }}
                    onClick={() => {
                      setCurrentDomain(dom);
                      setOpen(true);
                    }}
                  >
                    Set default
                  </button>
                  <button
                    className="find-btn sell-btn fl-right"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      margin: "0 4px",
                    }}
                  >
                    Sell Now
                  </button>
                  {/* </a> */}
                </li>
              ))}
            </ul>
            {!preNode.length && (
              <div style={{ marginTop: 30 }}>
                <h3 style={{ marginBottom: 3 }}>No domains yet</h3>
                <button className="find-btn">Find the perfect one</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDomains;
