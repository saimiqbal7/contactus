const {decrypt} = require('solana-encryption');
const { getNodeList } = './helpers';
const axios = require("axios");
const fetchIPFS = require("./dataFromCid");
require('dotenv').config();


async function main() {
  // Convert Solana Keypair to format compatible with ed2curve and TweetNaCl
  const privateKey_receiveString = process.env.TASK_CREATOR_PRIVATE_KEY;
  const privateKey_receive = new Uint8Array(privateKey_receiveString.split(',').map(Number));

  // const nodeList = await getNodeList(process.env.TASK_ID);

  let proofs_list = await axios
    .get("http://localhost:10000/nodeproofs/list")
    .then(function (response) {
      // handle success
      let proofs_list = response.data;
      return proofs_list;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  // Create a Set to store messages
  const messageSet = new Set();
  // Create a Set to store unique proof CIDs
  const proofCidSet = new Set(proofs_list);

  // Loop over unique proof_cids
  for (let proof_cid of proofCidSet) {
    const IPFSresponse = await fetchIPFS(proof_cid);
    let proofs = IPFSresponse.data.proofs;

    // Loop over proofs in current response
    for (let proof of proofs) {
      const decryptedMessage = await fetchAndDecrypt(proof, privateKey_receive);
      // Only add message to Set if it's not null
      if (decryptedMessage) {
        messageSet.add(decryptedMessage);
      }
    }
  }

  // Print out messages
  for (let message of messageSet) {
    console.log("decrypted: ", message);
  }
}

async function fetchAndDecrypt(proof, privateKey_receive) {
  const encrypted = new Uint8Array(Object.values(proof.encrypted));
  const nonce = new Uint8Array(Object.values(proof.nonce));
  const publicKey_send = proof.publicKey;

  const decrypted = decrypt(
    encrypted,
    nonce,
    publicKey_send,
    privateKey_receive
  );

  return decrypted;
}

main();
