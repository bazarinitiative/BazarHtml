import { PostDto, UserDto } from "../../facade/entity";
import { logger } from "../../utils/logger";
import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface SearchResult {
    users: UserDto[];
    posts: PostDto[];
}

export async function publicsearch(keys: string, page: number, pageSize: number) {
    var request_data = {
        keys: keys,
        page: page,
        pageSize: pageSize,
    }
    logger('publicsearch', keys)
    var ret = await getBazarData(API_ROUTER_CONFIG.publicsearch, request_data);
    return ret
}
