import { getRemoteUserInfo } from "../api/impl/userinfo";
import { getLocalUser, saveLocalUser } from "../utils/user-storage";
import { UserInfo } from "./entity";


var AsyncLock = require('async-lock');
var lock = new AsyncLock();

/**
 * get userInfo from remote, use localStorage as cache
 * @param {*} userID 
 * @returns userstr
 */
export async function getUserInfo(userID: string) {
    await lock.acquire("userInfo_" + userID, async () => {
        var userObj = getLocalUser(userID);
        if (userObj == null) {
            var ret = await getRemoteUserInfo(userID);
            if (ret.success) {
                var usernew = JSON.stringify(ret.data);
                var obj = JSON.parse(usernew) as UserInfo;
                saveLocalUser(obj, 300 * 1000);
            }
        }
    })
    var userObj = getLocalUser(userID);
    return userObj;

}
