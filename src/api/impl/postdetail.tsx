import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getPostDetail(postID: string, page: number, pageSize: number, userID: string) {
    var request_data = {
        postID: postID,
        page: page,
        pageSize: pageSize,
        userID: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.postdetail, request_data);
    return ret;
}
