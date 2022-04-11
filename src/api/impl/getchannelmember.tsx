import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface ChannelMember {
    userID: string,
    commandID: string,
    commandTime: number,
    cmID: string,
    channelID: string,
    memberID: string,
}

export interface ChannelMemberDto {
    channelMember: ChannelMember
}

export async function getChannelMembers(channelID: string) {
    var request_data = {
        channelID: channelID,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getchannelmembers, request_data);
    return ret;
}
