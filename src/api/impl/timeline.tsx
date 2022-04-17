import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

/** lang empty means all language */
export async function getPublicTimeline(userID: string, page: number, pageSize: number, lang: string) {
    var request_data = {
        userid: userID,
        pageSize: pageSize,
        page: page,
        lang: lang,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.publictimeline, request_data);
    return ret;
}
