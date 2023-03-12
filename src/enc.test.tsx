// import { testenc } from "./encryption"

import * as eee from 'elliptic'
import { logger } from "./logger";
import crypto from 'crypto'
import { base64ToBuffer, genKeyPairP521 } from './encryption';

test('test ed25519', () => {
    var ed = new eee.ec('ed25519');
    var secret = crypto.randomBytes(32);
    var key = ed.keyFromPrivate(secret);
    var priv = key.getPrivate();
    var pub = key.getPublic("array");
    var hex = key.getPublic('hex');
    logger('hex pub ' + hex.length, hex);
    var msg = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
    var sig = key.sign(msg).toDER();

    var ed2 = new eee.ec('ed25519');
    var key2 = ed2.keyFromPublic(pub);
    var ret1 = key2.verify(msg, sig);
    var ret2 = key2.verify(msg + '123', sig);
    logger('', ret1 + ' ' + ret2);
    expect(ret1).toBe(true);
    expect(ret2).toBe(false);
});

test('test secp256k1', () => {
    var ed = new eee.ec('secp256k1');
    var secret = crypto.randomBytes(32);
    var key = ed.keyFromPrivate(secret);
    var priv = key.getPrivate();
    var pub = key.getPublic("array");
    var msg = '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789';
    var sig = key.sign(msg).toDER();

    var ed2 = new eee.ec('secp256k1');
    var key2 = ed2.keyFromPublic(pub);
    var ret1 = key2.verify(msg, sig);
    var ret2 = key2.verify(msg.substring(0, 30), sig);
    logger('', ret1 + ' ' + ret2);
    expect(ret1).toBe(true);
    expect(ret2).toBe(false);
});

test('test p521 restore public', async () => {

});



