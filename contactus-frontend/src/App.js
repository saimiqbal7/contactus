import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import { RecoilRoot } from "recoil";
import { encrypt, decrypt, nonce } from "solana-encryption";
import { Keypair } from "@solana/web3.js"; 

function App() {

  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    sendData(data);
  }; // your form submit function which will invoke after successful validation

  const sendData = async (data) => {
    try {
      // console.log(data);

      const keypairA = Keypair.generate();
      const keypairB = Keypair.generate();

      const publicKeyA = keypairA.publicKey.toBase58()  ;
      const privateKeyA = keypairA.secretKey;

      const publicKeyB = keypairB.publicKey.toBase58();
      const privateKeyB = keypairB.secretKey;

   

      const newNonce = nonce();

      const message = JSON.stringify(data);

      setMessage(message);

      const encrypted = encrypt(
        message,
        newNonce,
        publicKeyB,
        privateKeyA
      );
      setEncryptedMessage(encrypted);

      const decrypted = decrypt(
        encrypted,
        newNonce,
        publicKeyA,
        privateKeyB
      );
      setDecryptedMessage(decrypted);


      const payload = {
        encrypted,
        nonce: newNonce,
        publicKey: publicKeyA,
      }

      console.log("payload to send ", payload)

      const response = await axios.post("http://192.168.2.41:10000/contact", {
        payload,
      });

      console.log(response);
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  };

  return (
    <RecoilRoot>
      <h1>Contact Us</h1>
      <div style={{ "text-align": "center", color: "white" }}>
        <div style={{'text-align': '-webkit-center'}}>
          <h2>Encrypted message:</h2>
          <h2 style={{ maxWidth: "800px", wordWrap: "break-word" }}>{encryptedMessage}</h2>
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
            borderRadius: '4px',
            border: '1px solid white',
            padding: '10px 15px'
          }}
          {...register("message", {required: false})}
        ></textarea>
        <input type="submit" />
      </form>
    </RecoilRoot>
  );
}

//

export default App;