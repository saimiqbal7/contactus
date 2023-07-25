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

  const contact = req.body.payload;

  // Check req.body
  if (!contact.encrypted && !contact.publicKey && !contact.nonce) {
    res.status(400).json({ error: 'Invalid data format' });
    return;
  } else {
    console.log(contact);
  }

  let encrypted = contact.encrypted;
  let publicKey = contact.publicKey;
  let nonce = contact.nonce;


  let proof = {
    encrypted,
    nonce,
    publicKey
  };
  console.log('Check Proof:', proof);

  // use fs to write the contact and proof to a file
  // if (!fs.existsSync('./contact')) fs.mkdirSync('./contact');
  // fs.writeFileSync(
  //   './contact/' + `contact_${publicKey}.json`,
  //   JSON.stringify(contact),
  // );
  // fs.writeFileSync('proof.json', JSON.stringify(proof));
  await db.setContact(publicKey, encrypted);

  const round = await namespaceWrapper.getRound();
  // TEST For only testing purposes:
  // const round = 1000

  console.log(`${publicKey} Proofs: `, proof);
  await db.setProofs(publicKey, proof);

  return res
    .status(200)
    .send({ message: 'Proof and contact registered successfully', data: req.body.payload });
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
router.get('/contactList', async (req, res) => {
  let contactList = (await db.getAllContacts()) || '[]';
  console.log(contactList)
  return res.status(200).send(contactList);
});

// accepts an upload of a new contact us submission
router.get('/proofs/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  let proof = await db.getProofs(publicKey);
  proof = proof || '[]';
  return res.status(200).send(proof);
});

// return list of all proofs
router.get('/proofsList', async (req, res) => {
  let proofsList = (await db.getAllProofs());
  return res.status(200).send(proofsList);
});

// returns 'proofs' aka encrypted contact us submissions to verify receipt of submissions
router.get('/nodeproofsList', async (req, res) => {
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
