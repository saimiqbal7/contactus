const express = require('express');
const cors = require('cors');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const sha256 = require('sha256');

const { namespaceWrapper } = require('./namespaceWrapper');

router.use(cors());

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

// returns the current task state from K2 via the namespacewrapper
router.get('/taskState', async (req, res) => {
  const state = await namespaceWrapper.getTaskState();
  console.log('TASK STATE', state);

  res.status(200).json({ taskState: state });
});

// Accepts an upload of a contact form
router.post('/contact', async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: 'Invalid request' }, req.body);
    return;
  } else {
    console.log(req.body);
  }

  const contact = req.body.data;

  // Check req.body
  if (!contact.name && !contact.email) {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  } else {
    console.log(contact);
  }

  // // Use the code below to sign the data payload

  // let id;
  // // Check if the contact is a string
  // if (typeof contact === 'string') {
  //   id = sha256(contact);
  // } else {
  //   // If not, convert it to a string and then hash it
  //   id = sha256(JSON.stringify(contact));
  // }
 
  let crypto = null;
  if (contact.crypto) {
  crypto = contact.crypto;
  }

  let proof = {
    crypto: crypto,
    contact: contact,
  };
  console.log('Check Proof:', proof);

  const pubkey = contact.email;
  // use fs to write the contact and proof to a file
  if (!fs.existsSync('./contact')) fs.mkdirSync('./contact');
  fs.writeFileSync(
    './contact/' + `contact_${pubkey}.json`,
    JSON.stringify(contact),
  );
  // fs.writeFileSync('proof.json', JSON.stringify(proof));
  await db.setContact(pubkey, contact);

  const round = await namespaceWrapper.getRound();
  // TEST For only testing purposes:
  // const round = 1000

  console.log(`${pubkey} Proofs: `, proof);
  await db.setProofs(pubkey, proof);

  return res
    .status(200)
    .send({ message: 'Proof and contact registered successfully', data: req.body.data });
});

// For debugging
router.get('/logs', async (req, res) => {
  const logs = fs.readFileSync('./namespace/logs.txt', 'utf8');
  res.status(200).send(logs);
});


// returns a contact for a particular public key
router.get('/contact/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let contact = await db.getContact(publicKey);
  contact = contact || '[]';
  return res.status(200).send(contact);
});

// returns list of all contacts
router.get('/contact/list', async (req, res) => {
  let contactList = await db.getAllContacts();
  contactList = contactList || '[]';
  return res.status(200).send(contactList);
});

// accepts an upload of a new contact us submission
router.get('/proofs/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let proof = await db.getProofs(publicKey);
  proof = proof || '[]';
  return res.status(200).send(proof);
});

// returns 'proofs' aka encrypted contact us submissions to verify receipt of submissions
router.get('/proofs/', async (req, res) => {
  contactNodeProofs = (await db.getAllNodeProofCids()) || '[]';
  return res.status(200).send(contactNodeProofs);
});

// returns proofs for a particular round
router.get('/nodeProofs/:round', async (req, res) => {
  const { round } = req.params;
  let nodeproof = (await db.getNodeProofCid(round)) || '[]';
  return res.status(200).send(nodeproof);
});

// provide a routing endpoint for the clientside app to query
router.get('/nodeurl', async (req, res) => {
  const nodeUrlList = await namespaceWrapper.getNodes();
  return res.status(200).send(nodeUrlList);
});

module.exports = router;
