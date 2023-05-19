const { namespaceWrapper } = require('./namespaceWrapper');
const { ensureIndex } = require('./helpers/ensureIndex');

ensureIndex();

// db functions for contact
const getContact = async publicKey => {
  const db = await namespaceWrapper.getDb();
  const contactId = getContactId(publicKey);
  try {
    const resp = await db.findOne({ contactId });
    if (resp) {
      return resp.contact;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const setContact = async (publicKey, contact) => {
  const db = await namespaceWrapper.getDb();
  try {
    const contactId = getContactId(publicKey);
    console.log('Set contact', { contactId, contact });
    await db.insert({ contactId, contact });
    return console.log('contact set');
  } catch (err) {
    console.error('Error insert data: ', err.key, err.errorType);
    return undefined;
  }
};

const getAllContacts = async () => {
  const db = await namespaceWrapper.getDb();
  const contactListRaw = await db.find({
    contact: { $exists: true },
  });
  let contactList = contactListRaw.map(contactList => contactList.contact);
  return contactList;
};

// namespaceWrapper.levelDB functions for proofs
const getProofs = async pubkey => {
  const db = await namespaceWrapper.getDb();
  const proofsId = getProofsId(pubkey);
  try {
    const resp = await db.findOne({ proofsId });
    if (resp) {
      return resp.proofs;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const setProofs = async (pubkey, proofs) => {
  const db = await namespaceWrapper.getDb();
  try {
    const proofsId = getProofsId(pubkey);
    await db.insert({ proofsId, proofs });
    return console.log('Proofs set');
  } catch (err) {
    return undefined;
  }
};

const getAllProofs = async () => {
  const db = await namespaceWrapper.getDb();
  const proofsListRaw = await db.find({
    proofs: { $exists: true },
  });
  console.log('Proofs List Raw', proofsListRaw);
  let proofsList = proofsListRaw.map(proofsList => proofsList.proofs);
  console.log('Proofs List', proofsList);
  return proofsList;
};

// db functions for node proofs
const getNodeProofCid = async round => {
  const db = await namespaceWrapper.getDb();
  const NodeProofsCidId = getNodeProofCidid(round);
  try {
    const resp = await db.findOne({ NodeProofsCidId });
    if (resp) {
      return resp.proofs;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const setNodeProofCid = async (round, cid) => {
  const db = await namespaceWrapper.getDb();
  try {
    const NodeProofsCidId = getNodeProofCidid(round);
    await db.insert({ NodeProofsCidId, cid });
    return console.log('Node CID set');
  } catch (err) {
    return undefined;
  }
};

const getAllNodeProofCids = async () => {
  const db = await namespaceWrapper.getDb();
  const NodeproofsListRaw = await db.find({
    cid: { $exists: true },
  });
  let NodeproofsList = NodeproofsListRaw.map(
    NodeproofsList => NodeproofsList.cid,
  );
  return NodeproofsList;
};

//db functions fro Auth list
const getAuthList = async pubkey => {
  const db = await namespaceWrapper.getDb();
  const authListId = getauthListid(pubkey);
  try {
    const resp = await db.findOne({ authListId });
    if (resp) {
      return resp.authList;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const setAuthList = async pubkey => {
  const db = await namespaceWrapper.getDb();
  try {
    const authListId = getauthListid(pubkey);
    await db.insert({ authListId, cid });
    return console.log('auth List CID set');
  } catch (err) {
    return undefined;
  }
};

const getAllAuthLists = async values => {
  const db = await namespaceWrapper.getDb();
  const authListRaw = await db.find({
    authList: { $exists: true },
  });
  let authList = authListRaw.map(authList => authList.authList);
  return authList;
};

const getNodeProofCidid = round => {
  return `node_proofs:${round}`;
};

const getContactId = publicKey => {
  return `contact:${publicKey}`;
};

const getProofsId = pubkey => {
  return `proofs:${pubkey}`;
};

const getAuthListId = round => {
  return `auth_list:${round}`;
};

module.exports = {
  getContact,
  setContact,
  getAllContacts,
  getProofs,
  setProofs,
  getAllProofs,
  getNodeProofCid,
  setNodeProofCid,
  getAllNodeProofCids,
  getAuthList,
  setAuthList,
  getAllAuthLists,
  getAuthListId,
};
