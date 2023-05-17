const { Connection, PublicKey } = require('@_koi/web3.js');
async function main() {
  const connection = new Connection('https://k2-testnet.koii.live');
  const accountInfo = await connection.getAccountInfo(
    new PublicKey('EJQn8MmfMyNVpmGp6cJ2PkHwmjccT3XEDe6eeMaFoFbN'),
  );
  console.log(JSON.parse(accountInfo.data+""));
}

main();