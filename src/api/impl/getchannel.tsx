import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getChannel(channelID: string) {
    var request_data = {
        channelID: channelID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getchannel, request_data);
    return ret;
}
