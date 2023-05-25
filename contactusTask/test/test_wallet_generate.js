const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');

// Function to create a new keypair and save the keys to a file
async function createAndSaveKeys() {
  try {
    // Create two new keypairs
    const keyPair1 = solanaWeb3.Keypair.generate();
    const keyPair2 = solanaWeb3.Keypair.generate();

    // Create JSON object to store the keys
    const keyData = {
      keyPair1: {
        publicKey: keyPair1.publicKey.toString(),
        privateKey: [...keyPair1.secretKey] // Convert Uint8Array to Array
      },
      keyPair2: {
        publicKey: keyPair2.publicKey.toString(),
        privateKey: [...keyPair2.secretKey] // Convert Uint8Array to Array
      }
    };

    // Convert JSON object to string
    const keyDataString = JSON.stringify(keyData, null, 2);

    // Write the key data to a new file
    fs.writeFileSync('keys.json', keyDataString);

    console.log("Keys saved to keys.json");
  } catch (error) {
    console.error("Failed to create keys and save them to a file:", error);
  }
}

// Call the function
createAndSaveKeys();