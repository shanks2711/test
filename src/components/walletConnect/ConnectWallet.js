import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "./Connector";
import { Grid, Box, Typography, Modal } from "@mui/material";
import React, { useEffect } from "react";
import { useEagerConnect } from "./useEgarConnect";
import { Spinner } from "./Spinner";
import { isMobile } from "react-device-detect";

const style = {
  position: "absolute",
  top: "50%",
  left: isMobile ? "40%" : "50%",
  transform: "translate(-50%, -50%)",
  width: isMobile ? "66%" : 450,
  borderRadius: "20px",
  bgcolor: "background.paper",
  //   border: '2px solid grey',
  boxShadow: 24,
  p: 2,
};

const connectorsByName = {
  Injected: injected,
  walletconnect: walletconnect,
};

const walletName = {
  Injected: "Metamask",
  walletconnect: "Wallet Connect",
};

const walletIcon = {
  Injected: "https://app.sushi.com/images/wallets/metamask.png",
  walletconnect: "https://app.sushi.com/images/wallets/wallet-connect.svg",
};

export default function ConnectWallet({ handleClose }) {
  const { activate, connector, error } = useWeb3React();
  const [activatingConnector, setActivatingConnector] = React.useState();

  const triedEager = useEagerConnect();

  const [open, setOpen] = React.useState(true);

  const onClose = () => {
    handleClose();
    setOpen(false);
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
        } catch (ex) {}
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);

  const activateWallet = async (currentConnector, connectorName) => {
    try {
      setActivatingConnector(currentConnector);

      const conn = currentConnector.connector;
      const Connector =
        typeof conn === "function" ? await conn() : currentConnector;
      await activate(Connector, undefined, true)
        .catch(async (error) => {
          setActivatingConnector();
        })
        .then((res) => {
          localStorage.setItem("isWalletConnected", true);
        });
    } catch (err) {}
  };

  //

  return (
    <div>
      <Modal
        open={open}
        onClose={() => onClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={
          {
            // width: 250,
          }
        }
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select a Wallet
          </Typography>
          <Grid>
            <Grid>
              {Object.keys(connectorsByName).map((name) => {
                const currentConnector = connectorsByName[name];
                const activating = currentConnector === activatingConnector;
                const connected = currentConnector === connector;
                const disabled =
                  !triedEager || !!activatingConnector || connected || !!error;
                const conn = currentConnector.connector;
                // const mobile = true
                if (isMobile && typeof conn !== "function") {
                  return (
                    <a
                      className="meta-mask-wallet-container"
                      href="https://metamask.app.link/dapp/illustrious-chimera-ccdffb.netlify.app"
                      style={{
                        width: isMobile ? "90%" : "100%",
                        color: "#000",
                        textDecoration: "none",
                        borderColor: activating
                          ? "orange"
                          : connected
                          ? "green"
                          : "unset",
                        cursor: disabled ? "not-allowed" : "pointer",
                        position: "relative",
                        backgroundColor: "#fff",
                        border: "1px solid grey",
                        margin: "10px 2px",
                        borderRadius: "10px",
                        padding: "10px",
                        display: "flex",
                      }}
                      key={name}
                      // onClick={() => activateWallet(currentConnector, connectorsByName[name])}
                    >
                      <div style={styles.options}>
                        <img
                          src={walletIcon.Injected}
                          style={styles.icons}
                          alt="wallet_icon"
                        />
                        <div>
                          <Typography style={styles.walletName}>
                            {walletName.Injected}
                          </Typography>
                        </div>
                      </div>
                      <div style={styles.loaderDiv}>
                        {activating && (
                          <Spinner color={"black"} style={styles.loader} />
                        )}
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <button
                      className="meta-mask-wallet-container"
                      style={{
                        width: "100%",
                        borderColor: activating
                          ? "orange"
                          : connected
                          ? "green"
                          : "unset",
                        cursor: disabled ? "not-allowed" : "pointer",
                        position: "relative",
                        backgroundColor: "#fff",
                        border: "1px solid grey",
                        margin: "10px 2px",
                        borderRadius: "10px",
                        padding: "10px",
                        display: "flex",
                      }}
                      disabled={disabled}
                      key={name}
                      onClick={() =>
                        activateWallet(currentConnector, connectorsByName[name])
                      }
                    >
                      <div style={styles.options}>
                        <img
                          src={walletIcon[name]}
                          style={styles.icons}
                          alt="wallet_icon"
                        />
                        <div>
                          <Typography style={styles.walletName}>
                            {walletName[name]}
                          </Typography>
                        </div>
                      </div>
                      <div style={styles.loaderDiv}>
                        {activating && (
                          <Spinner color={"black"} style={styles.loader} />
                        )}
                      </div>
                    </button>
                  );
                }
              })}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

const styles = {
  options: { display: "flex", width: "100%" },
  walletName: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "2px 20px",
  },
  loader: { height: "25%", marginLeft: "-1rem" },
  icons: { height: "32px", width: "32px" },
  loaderDiv: {
    position: "absolute",
    top: "0",
    right: "0",
    height: "100%",
    display: "flex",
    alignItems: "center",
    color: "black",
    margin: "0 0 0 1rem",
  },
};
