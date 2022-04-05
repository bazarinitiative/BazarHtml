import { PostDto } from "../../facade/entity";
import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";
import { NotifyMessage } from "./notifications";

export interface NotifyDto {
    noti: NotifyMessage,
    postDto: PostDto,
    isDirectReplyTo: boolean,
}

export async function getNotifyDtos(userID: string, queryTime: number, token: string, startTime: number, maxCount: number) {

    var request_data = {
        userid: userID,
        queryTime: queryTime,
        token: token,
        startTime: startTime,
        maxCount: maxCount
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getnotifydtos, request_data);
    return ret;
}
