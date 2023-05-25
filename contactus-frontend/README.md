# Contact Us Frontend   

## Description

This is the frontend for the Contact Us application. It is a React application. It provide functions that encrypt and decrypt messages. It also provides a form to send messages to the backend.

## Getting Started

### Install dependencies

```bash
npm install
or
yarn install
```

### Configure the .env file

Set up the .env file with the following variables:

```bash
REACT_APP_TASK_CREATOR_PUBLIC_KEY="<task creator public key>"
REACT_APP_TASK_CREATOR_PRIVATE_KEY='<task creator private key>'
REACT_APP_TASK_SENDER_PUBLIC_KEY='<task sender public key>'
REACT_APP_TASK_SENDER_PRIVATE_KEY='<task sender public key>'
REACT_APP_TASK_ID=''
```

### Fill out the form

Run `yarn start` to start the App. Fill out the form and submit it. The data will be encrypted and sent to the task node.

It will also show the encrypted data and the decrypted data.

## Encrypting form data

After the data is entered, it is encrypted to the public address and host it on one of the task nodes running that task. It use package `solana-encryption` to encrypt the data. In the back end when you fetch the data, you can use the same package to decrypt the data. Check `App.js` file `line:42` to `line:56` for more details.

## Submitting to the p2p database

The task nodes running the contact-us task are responsible for holding the encrypted payload by using the `nedb`. The encrypted data will be stored in the database and the task node will also upload the data to the IPFS. It will return the cid of the data on the IPFS. The user can use the cid to retrieve the data from the task node.