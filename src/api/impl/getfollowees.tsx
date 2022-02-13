import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp"

export async function getFollowees(userID: string, page: number, pageSize: number) {
    var request_data = {
        userID: userID,
        page: page,
        pageSize: pageSize,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getfollowees, request_data);
    return ret;
}
