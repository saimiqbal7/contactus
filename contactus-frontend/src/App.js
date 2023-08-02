import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./styles.css";
import { RecoilRoot } from "recoil";
import { Keypair } from "@_koi/web3.js";
import { encrypt, decrypt, nonce } from "solana-encryption";
import { setContact } from "./api";
import { getNodeList, decryptData } from "./helpers";
import JSEncrypt from "jsencrypt";
import { TASK_MANGER_ADDRESS } from "./config";
import { Buffer } from "buffer";

function App() {
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [nodeList, setNodeList] = useState(null);

  window.Buffer = Buffer;

  const encrypt = new JSEncrypt();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const listOfNodes = async () => {
      const list = await getNodeList();
      setNodeList(list);
    };
    listOfNodes();

    encrypt.setPublicKey(TASK_MANGER_ADDRESS);
  }, []);

  const onSubmit = (data) => {
    sendData(data);
  }; // your form submit function which will invoke after successful validation

  const sendData = async (data) => {
    try {
      const newNonce = "";

      const message = JSON.stringify(data);

      setMessage(message);

      const encrypted = encrypt.encrypt(data.message);

      setEncryptedMessage(encrypted);

      const payload = {
        encrypted,
        nonce: newNonce,
        publicKey: window?.k2?.publicKey?.toString(),
      };

      console.log(payload);

      // console.log("payload to send ", payload);

      // await setContact(nodeList, payload);
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  const handleOnChange = (e) => {
    console.log("e.target.result1", e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const data = decryptData(e, encryptedMessage, encrypt);

      console.log("data", data);
    };
  };

  return (
    <RecoilRoot>
      <h1>Contact Us</h1>
      <div style={{ "text-align": "center", color: "white" }}>
        <div style={{ "text-align": "-webkit-center" }}>
          <h2>Encrypted message:</h2>
          <h2 style={{ maxWidth: "800px", wordWrap: "break-word" }}>
            {encryptedMessage}
          </h2>
          <h2>Decrypted data:</h2>
          <h2>{decryptedMessage}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email", { required: true })} />
        {errors.email && <p>This field is required</p>}

        <label>Name</label>
        <input {...register("name", { required: true })} />
        {errors.name && <p>This field is required</p>}

        <label>Message</label>
        <textarea
          style={{
            width: "100%",
            height: "8em",
            boxSizing: "border-box",
            resize: "none",
            borderRadius: "4px",
            border: "1px solid white",
            padding: "10px 15px",
          }}
          {...register("message", { required: false })}
        ></textarea>
        <input type='submit' />
      </form>

      <input
        type='file'
        name='private key'
        onChange={handleOnChange}
        style={{ color: "#FFFFFF" }}
      />
    </RecoilRoot>
  );
}

//

export default App;
