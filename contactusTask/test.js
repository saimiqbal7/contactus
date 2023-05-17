const axios = require('axios');

async function getData(cid) {
  const callURL = await axios.get(`https://ipfs.io/ipfs/${cid}/data.json`);
  return JSON.stringify(callURL.data);
}

async function getDataFromCID() {
  let dataFromCID = [];
  const CIDs = [
    'bafybeidj4gqtw4of4kcgqhfel7uapeqhxmebafyifwliijdel6l7ldulym',
    'bafybeidfikafputdvon5ep4z4yjywcthx7uqndph3c6siwrqzzz3wde74u',
    'bafybeibsltilqnlwzhjvjbec5idv5ra4oyw4mgftyoggingabws2dbr4ye',
    'bafybeiflg6gnjzklix2wiyxli55gs3ibj7ah4wxudiyxkokoig7k5vkgh4',
  ];

  for (let i = 0; i < CIDs.length; i++) {
    let data = await getData(CIDs[i]);
    dataFromCID.push(data);
  }

  console.log(dataFromCID)
}

getDataFromCID();
// run node test