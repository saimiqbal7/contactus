export const decode = (data) => {

    const decoder = new TextDecoder();
    const decodedMessage = decoder.decode(data);

    return decodedMessage;

}

export const encode = (message) => {

    const encoder = new TextEncoder();
    const messageUint8 = encoder.encode(message);

    return messageUint8;

}

