import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import ConnectWalletButton from './ConnectWalletButton.js';
const nacl = require('tweetnacl');
const { Buffer } = require('buffer');

function encryptWithPublicKey(publicKey, data) {
  const publicKeyBytes = Buffer.from(publicKey, 'base64');
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const encryptedBytes = nacl.box(Buffer.from(data), nonce, publicKeyBytes, nacl.box.keyPair().secretKey);
  const encryptedMessage = Buffer.concat([nonce, encryptedBytes]);
  const encryptedData = encryptedMessage.toString('base64');
  return encryptedData;
}

const publicKey = 'V07LV6MOcZSexrZ/MaRyFM82z49/PGev64ncovdk7sg=';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    encryptWithPublicKey(publicKey, data);
    sendData(data)
  }; // your form submit function which will invoke after successful validation

  const sendData = async (data) => {
    try {
      const response = await axios.post('https://api.example.com/data', {
        'data': data,
      });

    } catch (error) {
      console.error('Error posting data: ', error);
    }
  };

  return (
    <>
      <h1>Contact Us</h1>
      <ConnectWalletButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email", { required: true })} />
        {errors.email && <p>This field is required</p>}
        <label>Name</label>
        <input {...register("name", { required: true })} />
        {errors.name && <p>This field is required</p>}
        <label>Comment</label>
        <textarea {...register("textArea")} ></textarea>
        <input type="submit" />
      </form>
    </>
  );
}


// 

export default App;