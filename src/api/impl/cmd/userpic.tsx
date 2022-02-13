import { Identity } from "../../../facade/entity";
import { sendCommand } from "../sendcommand";

export async function sendUserPic(identity: Identity, picstr: string) {

    var userPic = {
        userID: identity.userID,
        pic: picstr
    };
    var ret = await sendCommand(identity, 'UserPic', userPic)
    return ret;
}
