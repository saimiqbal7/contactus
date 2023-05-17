const axios = require('axios');

async function getCIDs() {
  try {
    // const response = await axios.get(`https://`);

    const CIDs = [
      'bafybeidj4gqtw4of4kcgqhfel7uapeqhxmebafyifwliijdel6l7ldulym',
      'bafybeidfikafputdvon5ep4z4yjywcthx7uqndph3c6siwrqzzz3wde74u',
      'bafybeibsltilqnlwzhjvjbec5idv5ra4oyw4mgftyoggingabws2dbr4ye',
      'bafybeiflg6gnjzklix2wiyxli55gs3ibj7ah4wxudiyxkokoig7k5vkgh4',
    ];

    return CIDs;
  } catch (error) {
    console.log(error);
  }
}

async function getData(cid) {
  try {
    const callURL = await axios.get(`https://ipfs.io/ipfs/${cid}/data.json`);
    return JSON.stringify(callURL.data);
  } catch (error) {
    console.log(error);
  }
}

async function getDataFromCID() {
  let dataFromCID = [];
  let CIDs = await getCIDs();

  for (let i = 0; i < CIDs.length; i++) {
    let data = await getData(CIDs[i]);
    dataFromCID.push(data);
  }

  console.log(dataFromCID);
}

getDataFromCID();
// run node test
