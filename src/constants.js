export const domains = [
  { tld: "tinyblock", address: "0xD69D2197a9543A1101733819A38Be65Dbdd7D2C3" },
  { tld: "crypto", address: "0x06C461E69AA7bC530D319e009c11ca15103546A6" },
  { tld: "nft", address: "0xe48f77D7bF9Dd6cF97eB4a5B50184B09fA272A6A" },
  { tld: "Metaverse", address: "0x90d21D4E3409046061c6b9C5D267445BE872Ab81" },
  { tld: "wallet", address: "0x809F000b8a8939f6F5eb9d86CEecc7F3C797Cd66" },
  // { tld: "bitcoin", address: "" },
  { tld: "DJ", address: "0x9d967e478c18616dd67E256676Be37b9568C8D14" },
  { tld: "888", address: "0x34814199328733295F8129229322C896b2F1c7a0" },
  { tld: "art", address: "0x912426A2A4D67f93A5B4EF9df5842b146851ef36" },
  { tld: "block", address: "0x660e2Be57B5e1B410157006e13a301AAc14BdBBb" },
];

export const ENS_CONTRACT = "0x30d2b91dD2b521a108ef1252FadB32F9042bc5Fa";

export const currentGasPrice = async (web3) => {
  let value;
  await web3.eth
    .getGasPrice()
    .then((res) => {
      value = parseInt(res * 2.1);
    })
    .catch((err) => {
      // Sentry.captureException("currentGasPrice ", err);
    });
  return value;
};
