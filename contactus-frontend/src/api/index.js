import axios from "axios";
import { TASK_ADDRESS } from "../config";

export async function setContact(nodeList, payload) {
  try {
    let nodeListIndex = 0;
    let result;

    while (!result && nodeList[nodeListIndex]) {
      result = await axios
        .post(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/contact`, {
          payload,
        })
        .then((res) => res.data)
        .catch((error) => console.log(`Error setting contact:`, error));
      nodeListIndex++;
    }

    if (result) {
      return result.message;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getAllContacts(nodeList) {
  try {
    let nodeListIndex = 0;
    let result;

    if (nodeList.length) {
      while (!result && nodeList[nodeListIndex]) {
        result = await axios
          .get(`${nodeList[nodeListIndex]}/task/${TASK_ADDRESS}/contactList`)
          .then((res) => res.data)
          .catch((error) => console.log(`Error fetching all contact:`, error));
        nodeListIndex++;
      }

      if (result) {
        return result;
      }
      return;
    }
  } catch (error) {
    console.log("Error getting node list:", error);
  }
}
