import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import { RecoilRoot } from 'recoil';
import JSEncrypt from 'jsencrypt';

const encrypt = (message, publicKey) => {
  let encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encrypted = encryptor.encrypt(message);
  console.log(encrypted);
  return encrypted;
}

// const decrypt = (encrypted, privateKey) => {
//   let decryptor = new JSEncrypt();
//   decryptor.setPrivateKey(privateKey);
//   return decryptor.decrypt(encrypted);
// }

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    sendData(data)
  }; // your form submit function which will invoke after successful validation

  const wallet = {
    publicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp2ksSdgEI3a1cbujD+Z8bQTFkFYP0zQcSnZWkWKgzUTNb4F10XpP+0h9zQP0Zr+TD0uBLFn2Qmgt1nLCFVCLLicv+7ANoGFB0oQ+CE1tS0UywBDonDuqo+CbOe4QuIEr+Pv1IUGAC9ipjzThlkI9RfhnkQgVS8vPkRui3x5N2xFD7A1d/4UohzkB8+od9X4s0aBm5kkZdDyVN7kVCYfpbKS/MDMplmlSS1LVH/5kqCxtWJNFA3aFAh6qxM1jFjgKqtP7zpKt9CPew1U0FNU9p0Ay62FdBLRiaaOUtLjYodDVl0G7R0maB5e3x1H5qp4kPy1ezHGiLS6rHotATFHkQQIDAQAB',
  }
 


  const sendData = async (data) => {
    try {
      console.log(data);

      let edata = encrypt(JSON.stringify(data), wallet.publicKey);
      // console.log(edata);

      // console.log(decrypt(edata));

      const response = await axios.post('http://192.168.2.41:10000/contact', {
        data: edata, 
      });
      
      console.log(response);

    } catch (error) {
      console.error('Error posting data: ', error);
    }
  };

  return (
    <RecoilRoot>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email", { required: true })} />
        {errors.email && <p>This field is required</p>}
        <label>Name</label>
        <input {...register("name", { required: true })} />
        {errors.name && <p>This field is required</p>}
        <label>Message</label>
        <textarea style={{width: '100%', 'min-height': '8em', boxSizing: 'border-box', resize: 'none' }} {...register("message")} ></textarea>
        <input type="submit" />
      </form>
    </RecoilRoot>
  );
}


// 

export default App;