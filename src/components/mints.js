/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractAbi from "../utils/contractABI.json";
import { domains, ENS_CONTRACT } from "../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import ENSabi from "../components/ABI/ENSNamingABI.json";
import ressolverABI from "../components/ABI/ressolverABI.json";
import fromExponential from "from-exponential";
import { Dialog, Grid, Typography } from "@mui/material";

const Mints = (props) => {
  const { account, library, chainId = 1 } = useWeb3React();
  const lib = library;
  const web3 = new Web3(lib?.provider);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [mints, setMints] = useState([]);
  const [domain, setDomain] = useState("");
  const [record, setRecord] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [CONTRACT_ADDRESS, setCONTRACT_ADDRESS] = useState(domains[0]);

  const [allDomains, setAllDomains] = useState([]);

  const [showLoader, setShowLoader] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const setDefaultNode = async () => {
    setShowLoader(true);
    let userwalletaddresss = account;
    const node = ""; // web3.utils.sha3(currentDomain);
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .setDefaultNode(node)
      .send({ from: userwalletaddresss })
      .then((res) => {
        // getNodeByAddress(userwalletaddresss)
        window.location.reload();
      })
      .catch((err) => {});
  };

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

  const getTokenId = async (node) => {
    let name;
    const userwalletaddresss = account;
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .getTokenId(node)
      .call({ from: userwalletaddresss })
      .then((res) => {
        // alert(res+" by address")
        name = res;
      })
      .catch((err) => {});
    return name;
  };

  const defaultNode = async () => {
    // let data;
    const userwalletaddresss = account;
    const strng = domain + "." + CONTRACT_ADDRESS.tld;
    // const node = web3.utils.sha3(strng);

    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .defaultNode(userwalletaddresss)
      .call({ from: userwalletaddresss })
      .then(async (res) => {
        await instance.methods
          .resolver(res)
          .call({ from: userwalletaddresss })
          .then(async (res) => {
            // data = await getNameByAddress(res);

            // setDefaultDomain(data)
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  const fetchMints = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // You know all this
        props.setShowLoader(true);

        const provider = new ethers.providers.Web3Provider(ethereum);
        // await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS.address,
          contractAbi.abi,
          signer
        );

        // Get all the domain names from our contract
        const names = await contract.getAllNames();

        // For each name, get the record and the address
        const mintRecords = await Promise.all(
          names.map(async (name) => {
            const mintRecord = await contract.records(name);
            const owner = await contract.domains(name);
            return {
              id: names.indexOf(name),
              name: name,
              record: mintRecord,
              owner: owner,
            };
          })
        );

        //
        setMints(mintRecords);
        props.setShowLoader(false);
        // fetchMyDomains();
      }
    } catch (error) {
      props.setShowLoader(false);

      setMints([]);
      toast.error("Something went wrong!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // This will run any time currentAccount or network are changed
  useEffect(() => {
    if (props.network === "Polygon Mumbai Testnet") {
      // fetchMints();
      getAllNodes();
      defaultNode();
    }
  }, [props.network]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchNetwork = async () => {
    const params = [
      {
        chainId: "0x13881",
        chainName: "Polygon Mumbai Testnet",
        rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
        nativeCurrency: {
          name: "Mumbai Matic",
          symbol: "MATIC",
          decimals: 18,
        },
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
      },
    ];
    try {
      await library?.send("wallet_switchEthereumChain", [
        { chainId: `0x13881` },
        account,
      ]);
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      // @ts-ignore TYPE NEEDS FIXING
      if (switchError.code === 4902) {
        try {
          await library?.send("wallet_addEthereumChain", [params, account]);
        } catch (addError) {
          // handle "add" error
          console.error(`Add chain error ${addError}`);
          alert(addError);
        }
      }
      alert(switchError);
    }
    // if (window.ethereum) {
    //   try {
    //     // Try to switch to the Mumbai testnet
    //     await window.ethereum.request({
    //       method: "wallet_switchEthereumChain",
    //       params: [{ chainId: "0x13881" }], // Check networks.js for hexadecimal network ids
    //     });
    //   } catch (error) {
    //     // This error code means that the chain we want has not been added to MetaMask
    //     // In this case we ask the user to add it to their MetaMask
    //     if (error.code === 4902) {
    //       try {
    //         await window.ethereum.request({
    //           method: "wallet_addEthereumChain",
    //           params: [
    //             {
    //               chainId: "0x13881",
    //               chainName: "Polygon Mumbai Testnet",
    //               rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    //               nativeCurrency: {
    //                 name: "Mumbai Matic",
    //                 symbol: "MATIC",
    //                 decimals: 18,
    //               },
    //               blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    //             },
    //           ],
    //         });
    //       } catch (error) {
    //
    //       }
    //     }
    //
    //   }
    // } else {
    //   // If window.ethereum is not found then MetaMask is not installed
    //   alert(
    //     "MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html"
    //   );
    // }
  };

  // const mintDomain = async () => {
  //   // Don't run if the domain is empty
  //   if (!domain) {
  //     return;
  //   }
  //   // Alert the user if the domain is too short
  //   if (domain.length < 3) {
  //     alert("Domain must be at least 2 characters long");
  //     return;
  //   }
  //   // Calculate price based on length of domain (change this to match your contract)
  //   // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
  //   const price =
  //     domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
  //
  //   try {
  //     props.setShowLoader(true);
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const contract = new ethers.Contract(
  //         CONTRACT_ADDRESS.address,
  //         contractAbi.abi,
  //         signer
  //       );

  //
  //       let tx = await contract.register(domain, {
  //         value: ethers.utils.parseEther(price),
  //       });
  //       // Wait for the transaction to be mined
  //       const receipt = await tx.wait();

  //       // Check if the transaction was successfully completed
  //       if (receipt.status === 1) {
  //
  //           "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
  //         );

  //         // Set the record for the domain
  //         tx = await contract.setRecord(domain, record);
  //         await tx.wait();

  //
  //           "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
  //         );

  //         // Call fetchMints after 2 seconds
  //         setTimeout(() => {
  //           // fetchMints();
  //           navigate("/my-domains");
  //         }, 2000);

  //         setRecord("");
  //         setDomain("");
  //       } else {
  //         props.setShowLoader(false);
  //         alert("Transaction failed! Please try again");
  //       }
  //     }
  //   } catch (error) {
  //
  //     props.setShowLoader(false);
  //     if (error?.data?.code === -32000) {
  //       toast.error("Insufficient funds for gas.");
  //     } else {
  //       toast.error(
  //         error?.data?.message || error?.message || "Something went wrong!",
  //         {
  //           position: toast.POSITION.TOP_RIGHT,
  //         }
  //       );
  //     }
  //   }
  // };

  const freeNodes = [
    "0x35006686fd78b85ed3fb52493d70cb3f7732177a19f352814df621b506c237a4",
    "0x7dd481eb4b63b94bb55e6b98aabb06c3b8484f82a4d656d6bca0b0cf9b446be0",
    "0xa5d9d90c1733b667e1acfd8c57a8e75a9dd2f6d097a7c718a909cdc5845a2210",
  ];

  const mintNewContract = async () => {
    setShowLoader(true);
    let amountIn;
    const userwalletaddresss = account;
    const domainNode = web3.utils.sha3(CONTRACT_ADDRESS.tld);
    if (freeNodes.includes(domainNode)) {
      amountIn = 0;
    } else {
      amountIn = web3.utils.toBN(
        fromExponential(domain.length * 1000000000000000)
      );
    }
    const strng = domain + "." + CONTRACT_ADDRESS.tld;
    const node = web3.utils.sha3(strng);
    const URI = "";

    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .Factory(domainNode, node, userwalletaddresss, strng, 2630000, URI)
      .send({ from: userwalletaddresss, value: amountIn })
      .then((res) => {
        // getNodeByAddress(userwalletaddresss)
        navigate("my-domains");
      })
      .catch((err) => {
        setShowLoader(false);
      });
  };

  const getAllNodes = async () => {
    const userwalletaddresss = account;
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .getAllNodes()
      .call({ from: userwalletaddresss })
      .then((res) => {
        //
        res.forEach(async (x) => {
          const data = await getNameByNode(x);
          const ID = await getTokenId(x);
          setAllDomains((pre) => [...pre, { name: data, id: ID }]);
        });
      })
      .catch((err) => {});
  };

  const getResolver = async (preNode) => {
    let address;
    const userwalletaddresss = account;
    // const strng = domain+"."+CONTRACT_ADDRESS.tld
    // const node =  web3.utils.sha3(strng)
    //
    const instance = new web3.eth.Contract(ENSabi, ENS_CONTRACT);
    await instance.methods
      .resolver(preNode)
      .call({ from: userwalletaddresss })
      .then((res) => {
        address = res;
        //
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

  const getNameByNode = async (node) => {
    let name;
    const userwalletaddresss = account;
    const address = await getResolver(node);
    const instance = new web3.eth.Contract(ressolverABI, address);
    await instance.methods
      .name(node)
      .call({ from: userwalletaddresss })
      .then((res) => {
        //
        // alert(res+" by address")
        name = res;
      })
      .catch((err) => {});
    return name;
  };

  const updateDomain = async () => {
    if (!record || !domain) {
      return;
    }
    setLoading(true);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS.address,
          contractAbi.abi,
          signer
        );

        let tx = await contract.setRecord(domain, record);
        await tx.wait();

        fetchMints();
        setRecord("");
        setDomain("");
      }
    } catch (error) {}
    setLoading(false);
  };

  // This will take us into edit mode and show us the edit buttons!
  // const editRecord = (name) => {
  //
  //   setEditing(true);
  //   setDomain(name);
  // };

  // Form to enter domain name and data

  const renderInputForm = () => {
    if (chainId !== 80001) {
      return (
        <div className="connect-wallet-container">
          <h2>Please switch to Polygon Mumbai Testnet</h2>
          <button className="cta-button mint-button" onClick={switchNetwork}>
            Click here to switch
          </button>
        </div>
      );
    }

    return (
      <div className="form-container">
        <div className="first-row">
          <div className="relative-div">
            <input
              type="text"
              value={domain}
              placeholder="domain"
              onChange={(e) => setDomain(e.target.value)}
            />
            <p className="tld"> .{CONTRACT_ADDRESS.tld} </p>
          </div>

          {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
          {editing ? (
            <div className="button-container">
              <button
                className="cta-button mint-button"
                disabled={loading}
                onClick={updateDomain}
              >
                Set record
              </button>

              <button
                className="cta-button mint-button"
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            // If editing is not true, the mint button will be returned instead
            <button
              className="cta-button mint-button"
              disabled={loading}
              onClick={mintNewContract}
            >
              Mint
            </button>
          )}
        </div>
        {domain.length ? (
          <Typography>Fees:- {domain.length * 0.001} Matic</Typography>
        ) : null}
      </div>
    );
  };

  const renderMints = () => {
    if (allDomains.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle"> Recently minted domains!</p>
          <div className="mint-list">
            {allDomains.map((mint, index) => {
              return (
                <div className="mint-item" key={mint}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={`https://testnets.opensea.io/assets/mumbai/${ENS_CONTRACT}/${mint.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="underlined">
                        {" "}
                        {mint.name}
                        {/* {`.${CONTRACT_ADDRESS.tld}`} */}
                      </p>
                    </a>
                    {/* If mint.owner is currentAccount, add an "edit" button*/}
                    {/* {mint.owner.toLowerCase() ===
                    props.currentAccount.toLowerCase() ? (
                      <button
                        className="edit-button"
                        onClick={() => editRecord(mint.name)}
                      >
                        <img
                          className="edit-icon"
                          src="https://img.icons8.com/metro/26/000000/pencil.png"
                          alt="Edit button"
                        />
                      </button>
                    ) : null} */}
                  </div>
                  {/* <p> {mint.record} </p> */}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ borderRadius: "10px" }}
      >
        <div style={{ margin: "20px" }}>
          <h2>you want to make it default domain</h2>
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
      </Dialog>
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
      <div
        style={{
          fontSize: "2.9991rem",
          fontWeight: "bold",
          padding: "30px 30px 0px 30px",
        }}
      >
        NFT Domains
        <div style={{ color: "rgb(100, 95, 242)" }}>No Renewal Fees Ever</div>
      </div>
      <div style={{ marginBottom: "20px" }}>
        {domains.map((dom, index) => (
          <button
            key={dom.address}
            className="tld-btn"
            style={
              CONTRACT_ADDRESS.address == dom.address
                ? { backgroundColor: "rgb(100, 95, 242)", color: "#fff" }
                : { backgroundColor: "#fff" }
            }
            onClick={() => {
              // setMints([]);
              setCONTRACT_ADDRESS(dom);
            }}
          >{`.${dom.tld}`}</button>
        ))}
      </div>
      {account && renderInputForm()}
      {mints && renderMints()}
      <Grid container>
        <Grid xs={12} md={6} item>
          <div>
            <h3 className="get-paid-head">A name for getting paid</h3>
            <p className="gpsubhead">
              Make sending and receiving crypto simple. Replace long,
              complicated wallet addresses with a single easy-to-read name.
            </p>
          </div>
        </Grid>
        <Grid xs={12} md={6} item>
          <div style={{ padding: "20px 60px 20px 60px" }}>
            <img
              alt=""
              src="https://storage.googleapis.com/unstoppable-client-assets/images/landing/new/use_case_3.png"
              style={{ width: "100%" }}
            />
          </div>
        </Grid>
      </Grid>

      <div className="spec">
        <div>
          <img
            alt=""
            src={`${process.env.PUBLIC_URL}/dollar.svg`}
            width="40"
            height="40"
          />
          <p>No renewal fees</p>
        </div>
        <div>
          <img
            alt=""
            src={`${process.env.PUBLIC_URL}/poly.png`}
            width="40"
            height="40"
          />
          <p>No gas fees on Polygon</p>
        </div>
        <div>
          <img
            alt=""
            src={`${process.env.PUBLIC_URL}/smile.svg`}
            width="40"
            height="40"
          />
          <p>Starting at $5+</p>
        </div>
        <div>
          <img
            alt=""
            src={`${process.env.PUBLIC_URL}/chat.svg`}
            width="40"
            height="40"
          />
          <p>24/7 customer support</p>
        </div>
      </div>

      <div className="acr-container">
        <div>
          <h1 className="faq-head">Frequently asked questions </h1>
        </div>
        <button class="accordion">Will I be able to transfer my domain?</button>
        <div class="panel">
          <p>
            Yes. The domain is stored in your cryptocurrency wallet. After you
            mint your domain on the blockchain, you can transfer it anywhere you
            like.
          </p>
        </div>

        <button class="accordion">
          Which cryptocurrencies can I use with my domain?
        </button>
        <div class="panel">
          <p>
            You can currently map any of over 294 cryptocurrency addresses to an
            Unstoppable domain to make payments easier.
          </p>
        </div>

        <button class="accordion">How can I view a NFT website?</button>
        <div class="panel">
          <p>
            You will need to use a mirroring service, a browser extension or a
            browser that supports NFT domains.
          </p>
        </div>
      </div>
    </>
  );
};

export default Mints;
