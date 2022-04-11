import { PostDto } from "../../facade/entity";
import { API_ROUTER_CONFIG } from "../config/api-config"
import { getBazarData } from "./BazarHttp";

export interface Bookmark {
    userID: string,
    commandID: string,
    commandTime: number,
    postID: string,
}

export interface BookmarkDto {
    bookmark: Bookmark,
    post: PostDto,
}

export async function getBookmarks(userID: string, page: number, pageSize: number) {
    var request_data = {
        userID: userID,
        page: page,
        pageSize: pageSize,
    }
    var ret = await getBazarData(API_ROUTER_CONFIG.getbookmarks, request_data);
    return ret;
}
