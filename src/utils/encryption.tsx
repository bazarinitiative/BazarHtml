
/*
    see also https://developer.mozilla.org/en-US/docs/Web/API/EcKeyGenParams
    see also https://github.com/mdn/dom-examples/blob/master/web-crypto/sign-verify/ecdsa.js
    see also https://github.com/mdn/dom-examples/blob/master/web-crypto/export-key/pkcs8.js
*/

import { logger } from "./logger";

function ab2str(buf: any) {
    return String.fromCharCode.apply(null, new Uint8Array(buf) as any);
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    const exportedAsString = ab2str(buffer);
    const exportedAsBase64 = window.btoa(exportedAsString);
    return exportedAsBase64;
}

export function base64ToarrayBuffer(str: string) {
    var binary_string = window.atob(str);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * 
 * @param privateKeyStr base64 encoded privateKey string
 * @returns CryptoKey object of privateKey
 */
export async function getPrivateKey(privateKeyStr: string) {
    var buf = base64ToarrayBuffer(privateKeyStr);
    return await window.crypto.subtle.importKey(
        'pkcs8',
        buf,
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        false,
        ["sign"]
    );
}

/**
 * 
 * @param publicKeyStr base64 encoded
 * @returns 
 */
export async function getPublicKey(publicKeyStr: string) {
    var buf = base64ToarrayBuffer(publicKeyStr);
    return await window.crypto.subtle.importKey(
        'spki',
        buf,
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        false,
        ["verify"]
    );
}

//should be same with relevant C# code
export async function genKeyPair() {
    var pair = await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-521",
        },
        true,
        ["sign", "verify"]
    )

    //export publieKey
    var exportedPub = await window.crypto.subtle.exportKey(
        "spki",
        pair.publicKey as any
    );
    var s1 = arrayBufferToBase64(exportedPub);
    logger('pub' + exportedPub.byteLength, s1);

    //export privateKey
    var exportedPriv = await window.crypto.subtle.exportKey(
        "pkcs8",
        pair.privateKey as any
    );
    var s2 = arrayBufferToBase64(exportedPriv);
    logger('priv' + exportedPriv.byteLength, s2);

    return { publicKey: s1, privateKey: s2 }
}

export const calculateUserID = (publicKey: any) => {
    var ay: number[] = []
    for (let index = 0; index < 30; index++) {
        ay[index] = 0;
    }
    for (var i = 0; i < publicKey.length; i++) {
        var pos = i % 30;
        ay[pos] += publicKey[i].charCodeAt();
    }

    var res: string[] = []
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var j = 0; j < ay.length; j++) {
        var idx = ay[j] % chars.length;
        res[j] = chars.charAt(idx);
    }
    return res.join("");
}

export async function signMessage(privateKey: CryptoKey, message: string) {
    let enc = new TextEncoder();
    let encoded = enc.encode(message);
    var buf = await window.crypto.subtle.sign(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        privateKey,
        encoded
    )
    var ret = arrayBufferToBase64(buf);
    return ret;
}

export async function verifyMessage(publicKey: CryptoKey, signature: string, message: string) {
    let enc = new TextEncoder();
    let encoded = enc.encode(message);
    var buf = base64ToarrayBuffer(signature);
    return await window.crypto.subtle.verify(
        {
            name: "ECDSA",
            hash: { name: "SHA-256" },
        },
        publicKey,
        buf,
        encoded
    )
}

/**
 * 
 * @param publicKeyStr base64 encoded
 * @param privateKeyStr base64 encoded
 */
export async function verifyKeyPair(publicKeyStr: string, privateKeyStr: string) {

    try {
        var publicKeyObj = await getPublicKey(publicKeyStr).catch(() => { return null })
        if (publicKeyObj == null) {
            return { success: false, msg: 'invalid publicKey' }
        }
        var privateKeyObj = await getPrivateKey(privateKeyStr).catch(() => { return null })
        if (privateKeyObj == null) {
            return { success: false, msg: 'invalid privateKey' }
        }
        var plain = "hello"
        var signed = await signMessage(privateKeyObj, plain);
        var ret = await verifyMessage(publicKeyObj, signed, plain);
        if (ret) {
            return { success: true, msg: '' }
        } else {
            return { success: false, msg: 'key pair not match' }
        }
    } catch (error) {
        return { success: false, msg: error as string }
    }

}

//include min, not include max
export const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const randomString = (len: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    var ret = '';
    for (let index = 0; index < len; index++) {
        var pos = randomInt(0, chars.length);
        ret += chars[pos];
    }
    return ret;
}

export const testEnc = () => {
    var s1 = "MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBe/LfuhSwCD/ZTJFkOivfMQPNDIfZrfOrkm10oF/Nl46VIgYFRveiQw5MPFwpSGDKRY+vj8B6oaIm/DNEZGCZcvOhgYkDgYYABAFTYt6N3RZh7i2aPnygAUib3uWa+K1dLylib3/85i0kDl1YLutgCs89cWNLn7ypv+RtYUoMYvLkBigYl48fq/X7LgGLKVhXzm2X8CNeTS5oz9cpO1wMO6soJmLvg1XdIwQRqqQKa37qVMsaJLUHTiGXawWE9kRxdFOyw2jlOlkHQhmbJQ==";
    var ppp = base64ToarrayBuffer(s1)
    var s2 = arrayBufferToBase64(ppp);
    if (s2 === s1) {
        return;
    } else {
        return;
    }
}

