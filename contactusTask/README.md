# Contact Us Task

This repo provides a contact us form functionality for the datafiend.ai app, and runs on a decentralized network of nodes.

## How it works?

1. User submit the contact us form in the app.
2. The app will send the message to the task node.
3. The message payload send to task node should contain the public key of the user, the nonce and the encryption.
4. The task node will store the encrpyt message with the public key of the user.
5. The proof of the message will be upload to IPFS.
6. The return cid will be the submission value.
