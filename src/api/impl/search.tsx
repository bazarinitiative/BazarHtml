import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export async function search(userID: string, queryTime: number, token: string, keys: string, page: number, pageSize: number) {
    var request_data = {
        userID: userID,
        queryTime: queryTime,
        token: token,
        keys: keys,
        page: page,
        pageSize: pageSize
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.search, request_data);
    return ret;
}
