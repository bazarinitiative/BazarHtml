import { PostDto, UserDto } from "../../facade/entity";
import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface SearchResult {
    users: UserDto[];
    posts: PostDto[];
}

/**
 * 
 * @param keys 
 * @param catalog can be Top, Latest, People. "" or null means Top
 * @param page 
 * @param pageSize 
 * @returns 
 */
export async function publicsearch(keys: string, catalog: string, page: number, pageSize: number) {
    var request_data = {
        keys: keys,
        catalog: catalog,
        page: page,
        pageSize: pageSize,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.publicsearch, request_data);
    return ret
}
