import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { walletState } from './state';

function ConnectWalletButton() {
  const [wallet, setWallet] = useRecoilState(walletState);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]);
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
        {wallet && <p style={{'text-align': 'center'}}>Connected account: {wallet}</p>}
      </div>
    </div>
    // <div>
    //   <button onClick={connectWallet}>Connect Wallet</button>
    //   {account && <p>Connected account: {account}</p>}
    // </div>
  );
}

export default ConnectWalletButton;
