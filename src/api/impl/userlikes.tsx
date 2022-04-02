import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getUserLikePosts(userID: string, page: number, pageSize: number, observerUserID: string) {
    var request_data = {
        userid: userID,
        page: page,
        pageSize: pageSize,
        observerUserID: observerUserID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.userlikes, request_data);
    return ret;

}