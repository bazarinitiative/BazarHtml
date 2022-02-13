import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getPublicTimeline(userID: string, page: number, pageSize: number) {
    var request_data = {
        userid: userID,
        pageSize: pageSize,
        page: page
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.publictimeline, request_data);
    return ret;
}
