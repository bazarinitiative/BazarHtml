import { API_ROUTER_CONFIG } from "../config/api-config"
import { postBazarData } from './BazarHttp';

export async function sendCode(targetEmailAddr: string, code: string) {

    var request_data = {
        targetEmailAddr: targetEmailAddr,
        code: code,
        lang: 'en'
    }
    var ret = await postBazarData(API_ROUTER_CONFIG.sendCode, request_data);
    return ret;
}
