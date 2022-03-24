import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getPostSimple(postID: string, page: number, pageSize: number, userID: string) {
    var request_data = {
        postID: postID,
        userID: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getpostsimple, request_data);
    return ret;
}
