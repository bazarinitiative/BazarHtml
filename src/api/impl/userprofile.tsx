import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getUserProfile(userID: string) {
    var request_data = {
        userid: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.userprofile, request_data);
    return ret;
}
