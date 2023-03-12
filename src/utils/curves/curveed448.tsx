import { BzKeyPair, ICurve } from "./ICurve";

class curveed448 implements ICurve {
    generateKeyPair(): Promise<BzKeyPair> {
        throw new Error("Method not implemented.");
    }
    derivePublicKey(privateKeyStr: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    sign(privateKeyStr: string, message: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    verify(publicKeyStr: string, message: string, signature: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}