
/*
	see also https://developer.mozilla.org/en-US/docs/Web/API/EcKeyGenParams
	see also https://github.com/mdn/dom-examples/blob/master/web-crypto/sign-verify/ecdsa.js
	see also https://github.com/mdn/dom-examples/blob/master/web-crypto/export-key/pkcs8.js
*/

import { logger } from "./logger";
import  base from 'base-x'
var BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
var bs62 = base(BASE62)

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
		true,
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

export async function restorePublicFromPrivate(privateKeyStr: string) {
	var key = await getPrivateKey(privateKeyStr);
	var pub = await getPublicP521(key);
	var exportedPub = await window.crypto.subtle.exportKey(
		"spki",
		pub as any
	);
	var s1 = arrayBufferToBase64(exportedPub);
	return s1;
}

const param521 = { name: "ECDSA", namedCurve: "P-521" };

async function getPublicP521(privateKey: CryptoKey) {
    const jwkPrivate = await crypto.subtle.exportKey("jwk", privateKey);
    delete jwkPrivate.d;
    jwkPrivate.key_ops = ["verify"];
    return crypto.subtle.importKey("jwk", jwkPrivate, param521, true, ["verify"]);
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

export function bufferToBase64(buffer: Uint8Array) {
    const exportedAsString = ab2str(buffer);
    const exportedAsBase64 = window.btoa(exportedAsString);
    return exportedAsBase64;
}

export function bufferToBase64a(buffer: ArrayBuffer) {
    var buf = new Uint8Array(buffer);
    return bufferToBase64(buf);
}

export function base64ToBuffer(str: string) {
    var binary_string = window.atob(str);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

export function bufferToBase62(buffer: Uint8Array) {
    var ret = bs62.encode(buffer);
	return ret;
}

export function base62ToBuffer(str: string) {
    var ret = bs62.decode(str);
	return ret;
}


// Convert a hex string to a byte array
export function hexToBytes(hexString: string) {
    if (hexString.length % 2 !== 0) {
        throw "Invalid hexString";
    }
    var arrayBuffer = new Uint8Array(hexString.length / 2);
    for (var i = 0; i < hexString.length; i += 2) {
        var sub = '0x' + hexString.substring(i, i + 2);
        var byteValue = parseInt(sub, 16);
        if (isNaN(byteValue)) {
            throw "Invalid hexString";
        }
        arrayBuffer[i / 2] = byteValue;
    }
    return arrayBuffer;
}

// Convert a byte array to a hex string
export function bytesToHex(bytes: Uint8Array) {
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
        let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

export function hexToBase64(hex: string) {
    var buf = hexToBytes(hex);
    return bufferToBase64(buf);
}

export function hexToBase62(hex: string) {
    var buf = hexToBytes(hex);
    return bufferToBase62(buf);
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

