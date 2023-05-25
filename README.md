<h1 align="center">
  <img src="https://raw.githubusercontent.com/koii-network/koii.X/main/.github/images/koii_logo.svg" width="224px"/><br/>
  Contact Us Task
</h1>
<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-007ACC?style=flat&logo=javascript&logoColor=white" alt="javascript" />&nbsp;
   <a href="https://discord.gg/koii" target="_blank"><img src="https://img.shields.io/badge/Discord-7289DA?style=flat&logo=discord&logoColor=white" alt="cli version" /></a>&nbsp;
   <a href="http://koii.network/" target="_blank"> <img src="https://img.shields.io/badge/made%20by-koii-blue" alt="made-by-koii" /></a>&nbsp;
</p>

# Contact Us Project

There are a lot of moving pieces in this application so we will break it into steps:
1. The Front End
2. The database (via Koii Tasks)
3. Retrieving form-fills

# Try it out

## Configure a keypair

- Prepare two keypairs for the task creator(website owner) and the user(client) respectively. You can use the following command to generate a keypair:

```javascript
const solanaWeb3 = require('@solana/web3.js');
const keyPair1 = solanaWeb3.Keypair.generate();
```

you can also check `contactusTask/test/test_wallet_generate.js` file, it will generate two new Solana keypairs and save them to `keys.json` file.

- Save it and pass into .env files for the next few steps

## Set up the p2p database on a Koii node

It is using Koii Task to set up the backend p2p database. Check the contactusTask folder for the task code. It provide REST endpoints and database modle to interact with the task node. Learn more about the Koii Task [here](https://docs.koii.network/develop/koii-task-101/what-are-tasks/).

### Set up the database and REST API

Check `db_model.js` file to customize the database model. It is using nedb as the database. *note: please use nedb to successfully connect with Koii Node*. 

Check `routes.js` file to customize the REST API. It is using express as the framework.

Then you can create your Koii task and deploy it to the Koii node. Learn more about how to create and deploy a task [here](https://docs.koii.network/quickstart/command-line-tool/create-task-cli).

## Set up the front-end in react

The front end is responsible for letting the user enter some data, encrypting it to the public address and host it on one of the task nodes running that task. To achieve this we need the following:

- Task creator public address to encrypt data
- Task nodes ip address to post the data to it

### Install dependencies

```bash
npm install
or
yarn install
```

### Configure the .env file

Set up the .env file with the following variables:

```bash
REACT_APP_TASK_CREATOR_PUBLIC_KEY=<task creator public key>
REACT_APP_TASK_CREATOR_PRIVATE_KEY=<task creator private key>
REACT_APP_TASK_SENDER_PUBLIC_KEY=<task sender public key>
REACT_APP_TASK_SENDER_PRIVATE_KEY=<task sender public key>
REACT_APP_TASK_NODE_IP=<task node ip address>
```


### Fill out the form

Run `yarn start` to start the App. Fill out the form and submit it. The data will be encrypted and sent to the task node.

## Encrypting form data

After the data is entered, it is encrypted to the public address and host it on one of the task nodes running that task. It use package `solana-encryption` to encrypt the data. In the back end when you fetch the data, you can use the same package to decrypt the data. Check `App.js` file `line:15` for more details.

## Submitting to the p2p database

### Find a koii node

It provide `helper.js` file that can help you find a koii node that is running the task. It will return the ip address of the node. You can use it to post the data to the node.

### POST e2ee data to the Koii nodes
For the user / clientside. User will submit the encrypted data to the task node. The task node will store the data in the database and upload the data to the IPFS. It will return the cid of the data on the IPFS. The user can use the cid to retrieve the data from the task node.

### GET e2ee data from the Koii nodes
For website owner, they can get the runnning node list and call their REST API to get the data. The data will be the cid of the data on the IPFS. The encrypted data will be stored in these cid and the task creator will be able to retrieve it using the cid. Creator can use the private key to decrypt the data and read the feedback.

# The p2p database
The task nodes running the contact-us task are responsible for holding the encrypted payload by using the `nedb`.

## What are task nodes

Head to docs to know more about [task nodes](https://docs.koii.network/run-a-node/introduction/task-nodes).

## The Contact-Us Task
Contact-us task provide REST endpoints to interact with the task node, for example:

- POST /contact
    This endpoint will receive the encrypted payload and store it in the task node database. Then the data will also uploaded to the IPFS and store the return cid.

- GET /proofs
    This endpoint will return all the proofs that the task node has. The data will be the cid of the data on the IPFS. The encrypted data will be stored in these cid and the task creator will be able to retrieve it using the cid. Creator can use the private key to decrypt the data and read the feedback.

## Testing Locally

After the task completed, you can use the docker to test it locally. Check the guide [here](https://docs.koii.network/develop/write-a-koii-task/task-development-kit-tdk/testing-locally-with-docker/) to use the docker. 

## Deploying the Task

You can use create-task-cli to deploy the task. Check the guide [here](https://docs.koii.network/quickstart/command-line-tool/create-task-cli) to deploy the task. After the task is deployed, you need to whitelist your task so that it can be run on the Koii node. Please contact our support team to whitelist your task [here](https://discord.gg/koii).

# Retrieving and decrypting the form-fill data
Once you have a working koii node running the task, and you're already running the react repo, you can fetch the form data and decrypt it using the following steps:

- Check contactusRead folder.
- Go through the README in that folder, it provide steps to setup the function.

The back end will retrieve the encrypted data from the task node, decrypt is using the private key of the task creator and viewing the data