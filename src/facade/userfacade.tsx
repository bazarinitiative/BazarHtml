import { getRemoteUserInfo, getRemoteUserPic } from "../api/impl/userinfo";
import { initialUserPic } from "../initdata/users";
import { getLocalPic, getLocalUser, saveLocalPic, saveLocalUser } from "../utils/user-storage";
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

/**
 * get userPic from remote, use localStorage as cache
 * @param {*} userID 
 * @returns picstr in base64 format
 */
export async function getUserPic(userID: string) {
    await lock.acquire("userPic_" + userID, async () => {
        var picstr = getLocalPic(userID);
        if (picstr === '') {
            var ret = await getRemoteUserPic(userID);
            if (ret.success) {
                var obj = ret.data;
                picstr = obj.pic;
                if (picstr === '') {
                    picstr = '';
                }
                saveLocalPic(userID, picstr, 300 * 1000);
            } else {
                picstr = initialUserPic;
                saveLocalPic(userID, picstr, 5 * 1000);
            }
        }
    });
    var picstr = getLocalPic(userID);
    return picstr;
}