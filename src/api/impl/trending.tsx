import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface TrendData {
    key: string,
    catalog: string,
    describe: string,
}

export async function getTrending(userID: string, queryTime: number, token: string, count: number) {
    var request_data = {
        userID: userID,
        queryTime: queryTime,
        token: token,
        count: count
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.trending, request_data);
    return ret;
}
