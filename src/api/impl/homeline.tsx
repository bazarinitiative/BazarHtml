import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function getHomeline(userID: string, queryTime: number, token: string, page: number, pageSize: number) {
    var request_data = {
        userid: userID,
        queryTime: queryTime,
        token: token,
        pageSize: pageSize,
        page: page
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.homeline, request_data);
    return ret;
}
