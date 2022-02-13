import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getFollowing(userID: string, targetID: string) {
    var request_data = {
        userID: userID,
        targetID: targetID
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getfollowing, request_data);
    return ret;
}
