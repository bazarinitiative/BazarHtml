import { Identity } from "../../../facade/entity";
import { sendCommand } from "../sendcommand";

export async function sendUserInfo(identity: Identity, userID: string, publicKey: string,
    userName: string, website: string, location: string, bio: string) {

    var userInfo = {
        userID: userID,
        publicKey: publicKey,
        userName: userName,
        website: website,
        location: location,
        biography: bio
    };
    var ret = await sendCommand(identity, 'UserInfo', userInfo)
    return ret;
}



