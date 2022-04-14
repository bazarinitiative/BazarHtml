import { getRemoteUserDto } from "../api/impl/userinfo";
import { HOST_CONCIG } from "../bazar-config";
import { getExtendIdentity, getIdentity, saveExtendIdentity, saveIdentity } from "../utils/identity-storage";
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

export function switchToIdentity(userID: string): true | string {
    var cur = getIdentity();
    if (cur == null) {
        return 'fail getIdentity'
    }
    if (cur.userID === userID) {
        return 'cannot switchh to same userID'
    }
    var ay = getExtendIdentity();
    if (ay == null) {
        return 'fail getExtendIdentity'
    }
    var idx = ay.findIndex(x => x.userID === userID);
    if (idx === -1) {
        return 'fail to find userID'
    }
    var to = ay[idx]
    ay.splice(idx, 1)
    saveIdentity(to)

    var curuser = cur.userID
    var idx2 = ay.findIndex(x => x.userID === curuser);
    if (idx2 !== -1) {
        return 'dup user found'
    }
    ay.push(cur)
    saveExtendIdentity(ay)
    return true
}
