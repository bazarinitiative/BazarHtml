import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

export async function sendLike(identity: Identity, postID: string) {

    var like = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        postID: postID,
    };
    var ret = await sendCommand(identity, 'Like', like)
    return ret;
}

