const { Connection, PublicKey } = require('@_koi/web3.js');
async function main() {
  const connection = new Connection('https://k2-devnet.koii.live');
  const accountInfo = await connection.getAccountInfo(
    new PublicKey('BWcviftAzjzXZizQB2sz7WjyjEWGgUZAJC3iDgr8srDj'),
  );
  console.log(JSON.parse(accountInfo.data+""));
}

main();