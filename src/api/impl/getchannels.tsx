import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface Channel {
    userID: string,
    commandID: string,
    commandTime: number,
    channelID: string,
    channelName: string,
    description: string,
}

export interface ChannelDto {
    channel: Channel,
    memberCount: number,
    followerCount: number,
}

export async function getUserChannels(userID: string) {
    var request_data = {
        userID: userID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getuserchannels, request_data);
    return ret;
}
