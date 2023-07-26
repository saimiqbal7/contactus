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
