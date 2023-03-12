import { base64ToBuffer, bufferToBase64, hexToBase64, hexToBytes } from "../encryption";
import { AlgoType, BzKeyPair, ICurve, getKeyBuf, prefixBzPriv, prefixBzPub } from "./ICurve";

import * as eee from 'elliptic';

export class curvep256k1 implements ICurve {
    async generateKeyPair(): Promise<BzKeyPair> {
        var ec = new eee.ec('secp256k1');
        var keys = ec.genKeyPair();
        var priv = keys.getPrivate('hex');
        var pub = keys.getPublic(true, 'hex');

        var ret = new BzKeyPair();
        ret.privateKeyStr = prefixBzPriv + AlgoType.secp256k1 + hexToBase64(priv);
        ret.publicKeyStr = prefixBzPub + AlgoType.secp256k1 + hexToBase64(pub);
        return ret;
    }

    async derivePublicKey(privateKeyStr: string): Promise<string> {
        var buf = getKeyBuf(privateKeyStr);
        var ec = new eee.ec('secp256k1');
        var key = ec.keyFromPrivate(buf);
        var pub = key.getPublic(true, 'hex');
        return prefixBzPub + AlgoType.secp256k1 + hexToBase64(pub);
    }

    async sign(privateKeyStr: string, message: string): Promise<string> {
        var buf = getKeyBuf(privateKeyStr);
        var ec = new eee.ec('secp256k1');
        var key = ec.keyFromPrivate(buf);
        var sig = key.sign(message).toDER('hex');
        return hexToBase64(sig);
    }

    async verify(publicKeyStr: string, message: string, signature: string): Promise<boolean> {
        var buf = getKeyBuf(publicKeyStr);
        var ec = new eee.ec('secp256k1');
        var key = ec.keyFromPublic(buf);
        var sig = base64ToBuffer(signature);
        var ret = key.verify(message, sig);
        return ret;
    }

}
