import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import { RecoilRoot } from "recoil";
import * as nacl from "tweetnacl";
import * as ed2curve from "ed2curve";
import { encrypt, decrypt } from "./encryptDecrypt";
import * as bs58 from "bs58";

function App() {
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

      const publicKeyA = "4VRqZyNrGUpApvgXAV39B342qdHTq9PGS2WbT55XzeaA";
      const privateKeyA = new Uint8Array([
        132, 74, 129, 68, 65, 80, 64, 127, 108, 40, 189, 220, 216, 232, 242, 66,
        61, 156, 83, 28, 10, 14, 47, 249, 132, 229, 232, 201, 248, 73, 89, 152,
        51, 219, 104, 59, 111, 32, 190, 25, 154, 141, 42, 177, 240, 132, 71,
        138, 87, 151, 35, 81, 74, 93, 169, 249, 188, 36, 23, 55, 53, 130, 24,
        255,
      ]);
      const publicKeyB = "DE9Bj5ZvuGaKzszMNH9kNZFUTtcsS61zkQk1osFCrD9R";
      const privateKeyB = new Uint8Array([
        178, 119, 119, 186, 189, 96, 234, 41, 118, 99, 34, 21, 5, 236, 129, 96,
        236, 182, 201, 0, 240, 23, 63, 251, 17, 210, 203, 123, 112, 141, 96,
        231, 181, 170, 12, 97, 4, 250, 99, 214, 92, 206, 137, 92, 57, 220, 203,
        160, 122, 135, 126, 89, 168, 120, 211, 143, 116, 178, 56, 63, 251, 185,
        61, 48,
      ]);

      const curve25519PublicKeyA = ed2curve.convertPublicKey(
        bs58.decode(publicKeyA)
      );
      const curve25519PrivateKeyA = ed2curve.convertSecretKey(privateKeyA);
      const curve25519PublicKeyB = ed2curve.convertPublicKey(
        bs58.decode(publicKeyB)
      );
      const curve25519PrivateKeyB = ed2curve.convertSecretKey(privateKeyB);

      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      const message = JSON.stringify(data);

      const encrypted = encrypt(
        message,
        nonce,
        curve25519PublicKeyB,
        curve25519PrivateKeyA
      );
      setEncryptedMessage(encrypted);

      const decrypted = decrypt(
        encrypted,
        nonce,
        curve25519PublicKeyA,
        curve25519PrivateKeyB
      );
      setDecryptedMessage(decrypted);

      // let edata = encrypt(JSON.stringify(data), wallet.publicKey);
      // console.log(edata);

      // console.log(decrypt(edata));

      const response = await axios.post("http://192.168.2.41:10000/contact", {
        encrypted,
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
          <h2>Decrypted message:</h2>
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
