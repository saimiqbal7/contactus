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
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = async (e) => {
      const privateKeyB = await getPrivateKey(e);
      const allContacts = await getAllContacts(nodeList);
      const contacts = allContacts?.map((contact) => {
        const messageBuffer = Buffer.from(contact?.encrypted, "base64");
        const nonceBuffer = Buffer.from(contact?.nonce, "base64");
        const decrypted = decrypt(
          new Uint8Array(messageBuffer.buffer),
          new Uint8Array(nonceBuffer.buffer),
          contact?.publicKey,
          privateKeyB
        );
        return JSON.parse(decrypted);
      });

      //   console.log(contacts);

      setContacts(contacts);
    };
  };

  return (
    <RecoilRoot>
      <h1>Contact Us</h1>
      {contacts && (
        <div className='table-header'>
          <div>Name</div>
          <div>Email</div>
          <div>Message</div>
        </div>
      )}

      {contacts?.map((contact) => {
        return (
          <div className='table-header'>
            <div>{contact.name}</div>
            <div>{contact.email}</div>
            <div>{contact.message}</div>
          </div>
        );
      })}

      {!contacts && (
        <>
          <p>Upload your taskCli private key</p>
          <input
            type='file'
            name='private key'
            onChange={handleOnChange}
            style={{ color: "#FFFFFF" }}
          />
        </>
      )}
    </RecoilRoot>
  );
}

export default Contacts;
