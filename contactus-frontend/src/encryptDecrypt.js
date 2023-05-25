import nacl from 'tweetnacl';
import { encode, decode } from './endecode';
import ed2curve from 'ed2curve';
import bs58 from 'bs58';


export const nonce = () =>{
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    return nonce;
}

export const encrypt = (message, nonce, publicKey_receiver, privateKey_sender) => {

    const curve25519PrivateKey_sender = ed2curve.convertSecretKey(privateKey_sender);
    const curve25519PublicKey_receiver = ed2curve.convertPublicKey(
        bs58.decode(publicKey_receiver)
      );

    const messageUint8 = encode(message);
    const encrypted = nacl.box(messageUint8, nonce, curve25519PublicKey_receiver, curve25519PrivateKey_sender);
    return encrypted;

}

export const decrypt = (encrypted, nonce, publicKey_sender, privateKey_receiver) => {

    const curve25519PrivateKey_receiver = ed2curve.convertSecretKey(privateKey_receiver);
    const curve25519PublicKey_sender = ed2curve.convertPublicKey(
        bs58.decode(publicKey_sender)
      );

    const decrypted = nacl.box.open(encrypted, nonce, curve25519PublicKey_sender, curve25519PrivateKey_receiver);
    const decryptedMessage = decode(decrypted);
    return decryptedMessage;

}
