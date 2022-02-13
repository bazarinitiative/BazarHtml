import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getRemoteUserInfo(userID: string) {
    var request_data = {
        userid: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.userinfo, request_data);
    return ret;
}

export async function getRemoteUserPic(userID: string) {
    var request_data = {
        userid: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.userpic, request_data);
    return ret;
}
