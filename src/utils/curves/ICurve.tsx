import { base64ToBuffer } from "../encryption";

export const prefixBzPub = 'bzpub';
export const prefixBzPriv = 'bzpriv';

export enum AlgoType {
    secp521r1 = '1',      //aka nistp521
    secp256k1 = '2',
    ed25519 = '3',
    // ed448 = '4',     //no trustworthy ed448 impl yet
    secpmax = '9'
}

export class BzKeyPair {
    /**
     * prefixBzPub + AlgoType + base64_publicKey
     */
    publicKeyStr: string = '';
    /**
     * prefixBzPriv + AlgoType + base64_privateKey
     * As forward compatbility, those old privateKeyStr start with 'MIH' will be treated as secp521r1 privateKey without prefix.
     */
    privateKeyStr: string = '';
}

/**
 * As forward compatbility to support old style keyStr
 * @param keyStr 
 */
export function regulateKeyStr(keyStr: string): string {
    var ret = '';
    if (keyStr.startsWith('MIH')) {
        //old private keyStr
        ret = prefixBzPriv + AlgoType.secp521r1 + keyStr;
    } else if (keyStr.startsWith('MIG')) {
        //old public keyStr
        ret = prefixBzPub + AlgoType.secp521r1 + keyStr;
    } else if (keyStr.startsWith(prefixBzPriv) || keyStr.startsWith(prefixBzPub)) {
        ret = keyStr;
    } else {
        throw new Error('unsupported keyStr: ' + keyStr);
    }
    return ret;
}

/**
 * extract base64 part of keyStr and convert to arrayBuffer
 * @param keyStr 
 * @returns 
 */
export function getKeyBuf(keyStr: string): Uint8Array {
    if (keyStr.startsWith(prefixBzPriv)) {
        var sub = keyStr.substring(prefixBzPriv.length + 1);
        return base64ToBuffer(sub);
    } else if (keyStr.startsWith(prefixBzPub)) {
        var sub = keyStr.substring(prefixBzPub.length + 1);
        return base64ToBuffer(sub);
    } else {
        throw new Error('unsupported keyStr: ' + keyStr);
    }
}

/**
 * support browser
 */
export interface ICurve {
    /**
     * 
     */
    generateKeyPair(): Promise<BzKeyPair>;

    /**
     * will return BzKeyPair.publicKeyStr
     * @param privateKeyStr should be BzKeyPair.privateKeyStr
     */
    derivePublicKey(privateKeyStr: string): Promise<string>;

    /**
     * signature in base64
     * @param privateKeyStr private key
     * @param message content msg to sign
     */
    sign(privateKeyStr: string, message: string): Promise<string>;

    /**
     * 
     * @param publicKeyStr 
     * @param message content msg to verify
     * @param signature signature to verify
     */
    verify(publicKeyStr: string, message: string, signature: string): Promise<boolean>;
}
