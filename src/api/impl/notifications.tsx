import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface NotifyMessage {
    notifyID: string,
    userID: string,
    notifyTime: number,
    notifyType: string,
    fromWho: string,
    fromWhere: string
}

export async function getNotifications(userID: string, queryTime: number, token: string, startTime: number, maxCount: number) {

    var request_data = {
        userid: userID,
        queryTime: queryTime,
        token: token,
        startTime: startTime,
        maxCount: maxCount
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getnotifications, request_data);
    return ret;
}
