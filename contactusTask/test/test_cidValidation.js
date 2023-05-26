const dataFromCid = require('../helpers/dataFromCid');
const nacl = require('tweetnacl');
const db = require('../db_model');
const bs58 = require('bs58');

// TEST hardcode the submission_value and round
let submission_value = "bafybeih34osgxqa4euewbmieili74xcn6adb6inc26kmz4pegbqj4vw3hi" // <= this is the CID of the Contact submission
let round = 7 // <= hardcode round

async function test_cidValidation(submission_value) {
  console.log('******/ TEST contact CID VALIDATION Task FUNCTION /******');
  const outputraw = await dataFromCid(submission_value);
  const output = outputraw.data;
  console.log('OUTPUT', output);
  console.log('RESPONSE DATA length', output.proofs.length);
  console.log('PUBLIC KEY', output.node_publicKey);
  console.log('SIGNATURE', output.node_signature);

  // Check that the node who submitted the proofs is a valid staked node
  let isNode = await verifyNode(
    output.proofs,
    output.node_signature,
    output.node_publicKey,
  );
  console.log("Is the node's signature on the CID payload correct?", isNode);

  // check each item in the contacts list and verify that the node is holding that payload, and the signature matches
  let isContact = await verifyContacts(output.proofs);
  console.log('IS Contact True?', isContact);

  if (isNode && isContact) return true; // if both are true, return true
  else return false; // if one of them is false, return false
}


// TODO - verify the section below to confirm whether the recipient pubkey
// is on the list of verified recipients
// Currently it appears we are verifiying if the sender is on a list,
// but that will be unlikely as most senders are likely to be anonymous
async function verifyContacts(proofs_list_object) {
  let allSignaturesValid = true;
  let AuthUserList = await db.getAllAuthLists();
  console.log('Authenticated Users List:', AuthUserList);

  // TODO: this part need to be fixed

  for (const proofs of proofs_list_object) {
    let publicKey = proofs.value[0].publicKey;

    // call other nodes to get the node list
    const nodeUrlList = await namespaceWrapper.getNodes();

    // TEST hardcode the node list
    // const nodeUrlList = [
    //   "http://localhost:10000",
    // ]

    // verify the signature of the Contact for each node
    for (const nodeUrl of nodeUrlList) {
      console.log('checking Contact on ', nodeUrl);

      // get all Contact in this node
      const res = await axios.get(
        `${nodeUrl}/task/${TASK_ID}/Contact/get/${publicKey}`,
      );

      // TEST hardcode the node endpoint
      // const res = await url axios.get(`${nodeUrl}/Contact/get/${publicKey}`);

      // check node's status
      if (res.status != 200) {
        console.error('ERROR', res.status);
        continue;
      }

      // get the payload
      const contact = res.data;

      // check if the user's pubkey is on the authlist
      if (AuthUserList.hasOwnProperty(contact.publicKey)) {
        console.log('User is on the auth list');
      } else {
        
        // Check if the public key is an ETH address
        if (contact.publicKey.length == 42) { 

          // Verify the ETH signature
          const { data, publicKey, signature } = contact;

          // Decode the signature
          const signatureBuffer = bs58.decode(signature);
          const r = signatureBuffer.slice(0, 32);
          const s = signatureBuffer.slice(32, 64);
          const v = signatureBuffer.slice(64);

          // Hash the message
          const message = JSON.stringify(data);
          const messageHash = web3.utils.keccak256(message);

          // Recover the signer's public key
          const publicKeyRecovered = ethUtil.ecrecover(
            ethUtil.toBuffer(messageHash),
            v[0],
            r,
            s,
          );

          // Convert the recovered public key to an Ethereum address
          const recoveredAddress = ethUtil.bufferToHex(
            ethUtil.pubToAddress(publicKeyRecovered),
          );

          // Check if the recovered address matches the provided public key
          if (recoveredAddress.toLowerCase() === publicKey.toLowerCase()) {
            console.log('Payload signature is valid');
            await db.setAuthList(publicKey);
          } else {
            console.log('Payload signature is invalid');
            allSignaturesValid = false;
          }

        } else {

          // Verify the signature
          const messageUint8Array = new Uint8Array(
            Buffer.from(JSON.stringify(contact.data)),
          );
          const signature = contact.signature;
          const publicKey = contact.publicKey;
          const signatureUint8Array = bs58.decode(signature);
          const publicKeyUint8Array = bs58.decode(publicKey);
          const isSignatureValid = await verifySignature(
            messageUint8Array,
            signatureUint8Array,
            publicKeyUint8Array,
          );
          console.log(`IS SIGNATURE ${publicKey} VALID?`, isSignatureValid);

          if (isSignatureValid) {
            await db.setAuthList(publicKey);
          } else {
            allSignaturesValid = false;
          }
        }
      }
    }
  }
  return allSignaturesValid;
}

async function verifyNode(proofs_list_object, signature, publicKey) {
  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(proofs_list_object)),
  );
  const signatureUint8Array = bs58.decode(signature);
  const publicKeyUint8Array = bs58.decode(publicKey);

  if (!proofs_list_object || !signature || !publicKey) {
    console.error('No data received from web3.storage');
    return false;
  }

  // verify the node signature
  const isSignatureValid = await verifySignature(
    messageUint8Array,
    signatureUint8Array,
    publicKeyUint8Array,
  );

  return isSignatureValid;
}

async function verifySignature(message, signature, publicKey) {
  return nacl.sign.detached.verify(message, signature, publicKey);
}

module.exports = test_cidValidation;

test_cidValidation(submission_value);