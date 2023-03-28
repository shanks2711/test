import * as React from "react";
import { useWeb3React } from "@web3-react/core";
import { truncateAddress } from "./CommonFunction";
import { Typography } from "@mui/material";

export default function MultipleSelectPlaceholder() {
  const { account } = useWeb3React();

  return (
    <div>
      <Typography style={styles.mainHeader}>
        {truncateAddress(account)}
      </Typography>
    </div>
  );
}

const styles = {
  mainHeader: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
  },
};
