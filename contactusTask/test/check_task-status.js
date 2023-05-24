const { Connection, PublicKey } = require('@_koi/web3.js');
async function main() {
  const connection = new Connection('https://k2-testnet.koii.live');
  const accountInfo = await connection.getAccountInfo(
    new PublicKey('EYQWPm64J1v6ZJinDx8iVUxxkLvGEEfx7a4xKgrxZfGL'),
  );
  console.log(JSON.parse(accountInfo.data+""));
}

main();