import { getRemoteUserDto } from "../api/impl/userinfo";
import { HOST_CONCIG } from "../bazar-config";
import { getLocalUser, saveLocalUser } from "../utils/user-storage";
import { UserDto } from "./entity";


var AsyncLock = require('async-lock');
var lock = new AsyncLock();

/**
 * get userDto from remote, use localStorage as cache
 * @param userID 
 * @returns 
 */
export async function getUserDto(userID: string) {
    await lock.acquire("userDto_" + userID, async () => {
        var dto = getLocalUser(userID);
        if (dto == null) {
            var ret = await getRemoteUserDto(userID);
            if (ret.success) {
                var usernew = JSON.stringify(ret.data);
                var obj = JSON.parse(usernew) as UserDto;
                saveLocalUser(obj, 300 * 1000);
            }
        }
    })
    var dto = getLocalUser(userID);
    return dto;
}

/**
 * get userInfo from remote, use localStorage as cache
 * @param {*} userID 
 * @returns userInfo
 */
export async function getUserInfo(userID: string) {
    var dto = await getUserDto(userID);
    if (!dto) {
        return null;
    }
    return dto.userInfo;
}

export function getUserImgUrl(dto: UserDto | null) {
    var lpt = dto?.lastPicTime;
    var url = `${HOST_CONCIG.apihost}UserQuery/UserPicImage/${dto?.userID}.jpeg?lpt=${lpt}`;
    return url
}

/**
 * convert to short strings for display
 * @param username 
 * @returns 
 */
export function getUserNameTitleLean(username: string) {
    var name = username;
    var title = '';
    var lean = 16
    if (username && username.length > 0 && username.charAt(0) > '~') {
        //not letter or number, usually wide char
        lean = 8
    }
    if (username.length > lean) {
        name = username.substring(0, lean) + '...';
        title = username;
    }
    return { name, title };
}

