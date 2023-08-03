import React, { useState, useEffect } from "react";
import "../styles.css";
import { RecoilRoot } from "recoil";
import { decrypt } from "solana-encryption";
import { getAllContacts } from "../api";
import { getNodeList, getPrivateKey } from "../helpers";
import { Buffer } from "buffer";

function Contacts() {
  const [contacts, setContacts] = useState(null);
  const [nodeList, setNodeList] = useState("");

  window.Buffer = Buffer;

  useEffect(() => {
    const listOfNodes = async () => {
      const list = await getNodeList();
      setNodeList(list);
    };
    listOfNodes();
  }, []);

  const handleOnChange = (e) => {
    console.log("e.target.result1", e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = async (e) => {
      const privateKeyB = await getPrivateKey(e);
      const allContacts = await getAllContacts(nodeList);
      const contacts = allContacts.slice(2).map((contact) => {
        console.log(
          new Uint8Array(contact?.encrypted),
          new Uint8Array(contact?.nonce),
          contact?.publicKey,
          contact?.encrypted,
          contact?.nonce
        );
        const decrypted = decrypt(
          new Uint8Array(contact?.encrypted),
          new Uint8Array(contact?.nonce),
          contact?.publicKey,
          privateKeyB
        );
        return decrypted;
      });

      console.log(contacts);

      //   setContacts(contacts);

      //   const decrypted = decrypt(
      //     encryptedMessage,
      //     newNonce,
      //     publicKeyA,
      //     privateKeyB
      //   );
      //   setDecryptedMessage(decrypted);
      console.log("data", allContacts);
    };
  };

  return (
    <RecoilRoot>
      <h1>Contact Us</h1>
      <div className='table-header'>
        <div>Name</div>
        <div>Email</div>
        <div>Message</div>
      </div>

      <div className='table-header'>
        <div>Name</div>
        <div>Email</div>
        <div>Message</div>
      </div>

      <input
        type='file'
        name='private key'
        onChange={handleOnChange}
        style={{ color: "#FFFFFF" }}
      />
    </RecoilRoot>
  );
}

export default Contacts;
