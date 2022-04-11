import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

export async function sendBookmark(identity: Identity, postID: string) {

    var bookmark = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        postID: postID,
    };
    var ret = await sendCommand(identity, 'Bookmark', bookmark)
    return ret;
}
