import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getUserPosts(userID: string, onlyOriginalPost: boolean, page: number, pageSize: number) {
    var request_data = {
        userid: userID,
        onlyOriginalPost: onlyOriginalPost,
        page: page,
        pageSize: pageSize
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.userposts, request_data);
    return ret;

}