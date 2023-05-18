import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import { RecoilRoot } from 'recoil';
import { AES, enc } from 'crypto-js';

const encrypt = (message, publicKey) => {
  const eData = AES.encrypt(message, publicKey);
}

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
    publicKey: '2062f6c4826b95dcc766876c6dacc5d3f31d1532601289571eb330d1bc0d75decb7dd95373f3f5552cde6cb151d0fe1efac6ad3cf5dc75255f48f98a96e5ea6d',
  }
 

  const sendData = async (data) => {
    try {
      console.log(data);

      console.log("ENCRYPT"); 
      let edata = encrypt(data, wallet.publicKey);
      console.log(edata);

      const response = await axios.post('http://192.168.2.41:10000/contact', {
        data, 
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