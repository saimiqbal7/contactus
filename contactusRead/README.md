## Decrpt and Read message

Run `yarn start` to start the app. The console should print the message.

The encrypted message is fetch from IPFS, which uploaded by Contact Us task.

### How to run

1. Replace your private key in `index.js`
1. `yarn install`
2. `yarn start`

*note*: the private key should be match your public Key that you used for receive message in React App.

All of the message should be printed in the console.

### How it works

1. Fetch the proofs list from task node.
2. For each of proofs, it's a cid that can be used to fetch the encrypted message from IPFS.
3. Create `messageSet` and `proofSet` that avoid duplicated message and proof.
3. Decrypt each message with the private key.
4. Print the message in the console.
