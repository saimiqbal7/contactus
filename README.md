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

   you can also check `contactusTask/test/test_wallet_generate.js` file, it will generate two new Solana keypairs and print out the public and private keys.

- Save it and pass into .env files for the next few steps

## Set up the p2p database on a Koii node

## Set up the front-end in react

### Fill out the form

## Fetch and decrypt form fill using local keypair

# The front end 
The front end is responsible for letting the user enter some data. 

## Encrypting form data
After the data is entered, it is encrypted to the public address and host it on one of the task nodes running that task. To achieve this we need the following:
	
Task creator public address to encrypt data
Task nodes ip address to post the data to it

## Submitting to the p2p database

### Find a koii node

### POST e2ee data to the Koii nodes
i.e. for the user / clientside


### GET e2ee data from the Koii nodes
i.e. for website owner

# The p2p database
The task nodes running the contact-us task are responsible for  holding the encrypted payload.

## What are task nodes
< one line description and a link to the koii docs > 

## The Contact-Us Task
Contact-us task provide REST endpoints to interact with the task node:

- POST /contact/
    This endpoint will receive the encrypted payload and store it in the task node database. Then the data will also uploaded to the IPFS and store the return cid.

- GET /proofs
    This endpoint will return all the proofs that the task node has. The data will be the cid of the data on the IPFS. The encrypted data will be stored in these cid and the task creator will be able to retrieve it using the cid. Creator can use the private key to decrypt the data and read the feedback.

## Testing Locally

## Deploying the Task


# Retrieving and decrypting the form-fill data
.... once you have a working koii node running the task, and you're already running the react repo, you can fetch the form data and decrypt it ... < instructions >

The back end will retrieve the encrypted data from the task node, decrypt is using the private key of the task creator and viewing the data