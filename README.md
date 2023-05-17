# Contact Us Project

There are a lot of moving pieces in this application so we will break it into steps:

# The front end 

The front end is responsible for getting some data from the user. Once we get the data, we need to encrypt it to the task creator’s public address and host it on one of the task nodes running that task. To achieve this we need the following:
	
Task creator public address to encrypt data
Task nodes ip address to post the data to it

# The task node

The task nodes running the contact-us task are responsible for  holding the encrypted payload.

Contact-us task provide REST endpoints to interact with the task node:

- POST /contact/
    This endpoint will receive the encrypted payload and store it in the task node database. Then the data will also uploaded to the IPFS and store the return cid.

- GET /proofs
    This endpoint will return all the proofs that the task node has. The data will be the cid of the data on the IPFS. The encrypted data will be stored in these cid and the task creator will be able to retrieve it using the cid. Creator can use the private key to decrypt the data and read the feedback.

# The back end 

The back end will retrieve the encrypted data from the task node, decrypt is using the private key of the task creator and viewing the data
