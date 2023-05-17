import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./styles.css";
import { RecoilRoot } from 'recoil';

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
    <RecoilRoot>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register("email", { required: true })} />
        {errors.email && <p>This field is required</p>}
        <label>Name</label>
        <input {...register("name", { required: true })} />
        {errors.name && <p>This field is required</p>}
        <label>Comment</label>
        <textarea style={{width: '100%', 'min-height': '8em', boxSizing: 'border-box', resize: 'none' }} {...register("textArea")} ></textarea>
        <input type="submit" />
      </form>
    </RecoilRoot>
  );
}


// 

export default App;