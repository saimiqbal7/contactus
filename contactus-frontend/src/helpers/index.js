import axios from "axios";
import { Keypair } from "@_koi/web3.js";
import { TASK_ADDRESS } from "../config";
import JSEncrypt from "jsencrypt";

export const getNodeList = async () => {
  let nodeList = [];
  const fallbackNodes = [
    `https://tasknet.koii.live/`,
    `https://tasknet-ports-1.koii.live/`,
    `https://tasknet-ports-2.koii.live/`,
  ];

  try {
    let nodeResponse = await axios.get(
      `https://tasknet-ports-1.koii.live/nodes/${TASK_ADDRESS}`
    );
    for (let i = 0; i < nodeResponse.data.length; i++) {
      console.log(nodeResponse);
      nodeList.push(nodeResponse.data[i].data.url);
    }
  } catch (error) {
    console.error(
      "Failed to fetch node list from primary node. Falling back to fallback nodes..."
    );
    nodeList = fallbackNodes;
  }

  return nodeList;
};

export const decryptData = (e, encryptedMessage, decrypt) => {
  console.log("e.target.result", e.target.result);
  const jsonKey = JSON.parse(e?.target?.result);
  const mainWallet = Buffer.from(jsonKey, "base64");

  decrypt.setPrivateKey(mainWallet);

  console.log(mainWallet);

  console.log(encryptedMessage);

  const decryptData = decrypt.decrypt(encryptedMessage);

  console.log(decryptData);

  return null;
};
