import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getChannelPosts(channelID: string, page: number, pageSize: number, observerUserID: string) {
    var request_data = {
        channelID: channelID,
        page: page,
        pageSize: pageSize,
        observerUserID: observerUserID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getchannelposts, request_data);
    return ret;
}
