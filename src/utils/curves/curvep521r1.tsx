
import { bufferToBase64, base64ToBuffer, bufferToBase64a } from "../encryption";
import { AlgoType, BzKeyPair, ICurve, getKeyBuf, prefixBzPriv, prefixBzPub } from "./ICurve";

const param521 = { name: "ECDSA", namedCurve: "P-521" };

/**
 * export to base64 string
 * @param key 
 * @returns 
 */
async function exportKey(key: CryptoKey | any) {
    if (key.type == 'private') {
        var buf = await crypto.subtle.exportKey(
            'pkcs8',
            key
        );
        return bufferToBase64a(buf);
    } else if (key.type == 'public') {
        var buf = await crypto.subtle.exportKey(
            'spki',
            key
        );
        return bufferToBase64a(buf);
    }
}

async function getPublicP521(privateKey: CryptoKey) {
    const jwkPrivate = await crypto.subtle.exportKey("jwk", privateKey);
    delete jwkPrivate.d;
    jwkPrivate.key_ops = ["verify"];
    return crypto.subtle.importKey("jwk", jwkPrivate, param521, true, ["verify"]);
}

export class curvep521r1 implements ICurve {

    async generateKeyPair(): Promise<BzKeyPair> {
        var ret = new BzKeyPair();
        var pair = await crypto.subtle.generateKey(
            param521,
            true,
            ['sign', 'verify']
        )
        ret.privateKeyStr = prefixBzPriv + AlgoType.secp521r1 + await exportKey(pair.privateKey);
        ret.publicKeyStr = prefixBzPub + AlgoType.secp521r1 + await exportKey(pair.publicKey);
        return ret;
    }

    async derivePublicKey(privateKeyStr: string): Promise<string> {
        if (!privateKeyStr.startsWith(prefixBzPriv)) {
            throw new Error('unsupported private key, maybe need regulateKeyStr first');
        }
        var buf = getKeyBuf(privateKeyStr);
        var ckey = await crypto.subtle.importKey(
            'pkcs8',
            buf,
            param521,
            true,
            ['sign']
        );
        var pub = await getPublicP521(ckey);
        return prefixBzPub + AlgoType.secp521r1 + await exportKey(pub);
    }

    async sign(privateKeyStr: string, message: string): Promise<string> {
        if (!privateKeyStr.startsWith(prefixBzPriv)) {
            throw new Error('unsupported private key, maybe need regulateKeyStr first');
        }
        var buf = getKeyBuf(privateKeyStr);
        var ckey = await crypto.subtle.importKey(
            'pkcs8',
            buf,
            param521,
            true,
            ['sign']
        );
        let enc = new TextEncoder();
        let encoded = enc.encode(message);
        var sig = await crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            ckey, encoded);
        return bufferToBase64a(sig);
    }

    async verify(publicKeyStr: string, message: string, signature: string): Promise<boolean> {
        if (!publicKeyStr.startsWith(prefixBzPub)) {
            throw new Error('unsupported public key, maybe need regulateKeyStr first');
        }
        var pubbuf = getKeyBuf(publicKeyStr);
        var ckey = await crypto.subtle.importKey('spki', pubbuf, param521, true, ['verify']);
        let enc = new TextEncoder();
        let encoded = enc.encode(message);
        var sigbuf = base64ToBuffer(signature);
        return await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            ckey,
            sigbuf,
            encoded
        )
    }
}
