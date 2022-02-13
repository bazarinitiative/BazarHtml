import { API_ROUTER_CONFIG } from '../config/api-config'
import { postBazarData } from './BazarHttp';

export async function backupAccount(targetEmailAddr: string, publicKey: string, privateKey: string) {
    var request_data = {
        targetEmailAddr: targetEmailAddr,
        publicKey: publicKey,
        privateKey: privateKey,
        lang: 'en'
    }
    var ret = await postBazarData(API_ROUTER_CONFIG.backupaccount, request_data);
    return ret;
}
