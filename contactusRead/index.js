const encryptDecrypt = require("./encryptDecrypt");
const ed2curve = require("ed2curve");
const axios = require("axios");
const fetchIPFS = require("./dataFromCid");
const bs58 = require("bs58");

async function main() {
  // Convert Solana Keypair to format compatible with ed2curve and TweetNaCl
  const privateKey_receive = new Uint8Array([
    178, 119, 119, 186, 189, 96, 234, 41, 118, 99, 34, 21, 5, 236, 129, 96, 236,
    182, 201, 0, 240, 23, 63, 251, 17, 210, 203, 123, 112, 141, 96, 231, 181,
    170, 12, 97, 4, 250, 99, 214, 92, 206, 137, 92, 57, 220, 203, 160, 122, 135,
    126, 89, 168, 120, 211, 143, 116, 178, 56, 63, 251, 185, 61, 48,
  ]);

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
