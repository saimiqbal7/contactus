import React, { useState } from 'react';

function ConnectWalletButton() {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected request to connect with MetaMask.");
      }
    } else {
      console.error("Non-Ethereum browser detected. You should consider trying MetaMask.");
    }
  };

  return (
    <div>
      <div >
        <button onClick={connectWallet} style={{margin: '0 auto'}}>Connect Wallet</button>
        {account && <p style={{'text-align': 'center'}}>Connected account: {account}</p>}
      </div>
    </div>
    // <div>
    //   <button onClick={connectWallet}>Connect Wallet</button>
    //   {account && <p>Connected account: {account}</p>}
    // </div>
  );
}

export default ConnectWalletButton;
