const {default: axios} = require('axios');
const {v4: uuidv4} = require('uuid');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require("fs")
const solanaWeb3 = require('@solana/web3.js');
const crypto = require('crypto');

// This test submits contacts from differnet publicKey to the service and stored in localdb
async function main() {
try {
  const keyPair = nacl.sign.keyPair();
  const publicKey = keyPair.publicKey;
  const privateKey = keyPair.secretKey;
  // const {publicKey, secretKey} = nacl.sign.keyPair.fromSecretKey(
  //   new Uint8Array(JSON.parse(fs.readFileSync("./test_wallet.json", 'utf-8')))
  // );
  console.log('publicKey', bs58.encode(publicKey));
  const data = {
    uuid: uuidv4(),
    contact: {
      name: 'test',
      email: 'test@gmail.com',
      message: 'test message',
    },
    timestamp: Date.now(),
  }
  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(data)),
  );
  const signedMessage = nacl.sign(messageUint8Array, privateKey);
  const signature = signedMessage.slice(0, nacl.sign.signatureLength);
  const payload = {
    data,
    publicKey: bs58.encode(publicKey),
    signature: bs58.encode(signature),
  };

  // Check payload
  // console.log(payload);
  
  await axios
    .post('http://localhost:10000/contact', {payload})
    .then((e) => {
      if (e.status != 200) {
        console.log(e);
      }
      console.log(e.data);
    })
    .catch((e) => {
      console.error(e);
    });
  }
  catch (e) {
    console.error(e);
  }
}

main();

module.exports = main;