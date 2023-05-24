const axios = require("axios");

export const getNodeList = async(taskID) => {
    let nodeList = []
    let nodeResponse = await axios.get(
      `https://k2-tasknet.koii.live/nodes/${taskID}`
    );
    for (let i = 0; i < nodeResponse.data.length; i++) {
      nodeList.push(nodeResponse.data[i].data.url);
      }
    console.log(nodeList)
    return nodeList
};

export const fetchData = async (nodeURL, taskID) => {

  try {
    const response = await axios.get(`${nodeURL}/task/${taskID}/nodeProofs/list`);
    if (response.data && response.data.data) {
      console.log(`Data found in node ${i}:`, response.data.data);
      const userData = response.data.data.linktree;
      return userData;
    }
  } catch (error) {
    return 'Error'
  }


};
