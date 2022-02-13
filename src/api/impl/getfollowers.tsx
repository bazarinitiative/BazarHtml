import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getFollowers(userID: string, page: number, pageSize: number) {
    var request_data = {
        userID: userID,
        page: page,
        pageSize: pageSize,

    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getfollowers, request_data);
    return ret;
}
