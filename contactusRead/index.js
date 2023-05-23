const encryptDecrypt = require("./encryptDecrypt");
const { getNodeList } = './helpers';
const ed2curve = require("ed2curve");
const axios = require("axios");
const fetchIPFS = require("./dataFromCid");
const bs58 = require("bs58");

async function main() {
  // Convert Solana Keypair to format compatible with ed2curve and TweetNaCl
  const privateKey_receive = new Uint8Array(process.env.TASK_RECEIVER_PRIVATE_KEY);

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

  const curvePublicKey_send = ed2curve.convertPublicKey(
    bs58.decode(publicKey_send)
  );
  const curvePrivateKey_receive = ed2curve.convertSecretKey(privateKey_receive);

  if (!curvePublicKey_send) {
    throw new Error(
      "Failed to convert publicKey_send. Is it a valid Ed25519 key?"
    );
  }

  if (!curvePrivateKey_receive) {
    throw new Error(
      "Failed to convert privateKey_receive. Is it a valid Ed25519 key?"
    );
  }

  const decrypted = encryptDecrypt.decrypt(
    encrypted,
    nonce,
    curvePublicKey_send,
    curvePrivateKey_receive
  );

  return decrypted;
}

main();
