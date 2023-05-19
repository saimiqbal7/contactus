import nacl from 'tweetnacl';
import { encode, decode } from './endecode';



export const encrypt = (message, nonce, publicKeyB, privateKeyA) => {

    const messageUint8 = encode(message);
    const encrypted = nacl.box(messageUint8, nonce, publicKeyB, privateKeyA);
    return encrypted;

}

export const decrypt = (encrypted, nonce, publicKeyA, privateKeyB) => {

    const decrypted = nacl.box.open(encrypted, nonce, publicKeyA, privateKeyB);
    const decryptedMessage = decode(decrypted);
    return decryptedMessage;

}
