import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { randomString } from "../../../utils/encryption";
import { sendCommand } from "../sendcommand";

/**
 * 
 * @param identity identity obj
 * @param content content str
 * @param replyTo value '' means first post of a thread
 * @param threadID value '' means first post of a thread
 * @param isRepost 
 */
export async function sendPost(identity: Identity, content: string, replyTo: string, threadID: string, isRepost: boolean) {

    var postID = randomString(30);
    if (threadID === '') {
        threadID = postID;
    }

    var post = {
        userID: identity.userID,
        content: content,
        postID: postID,
        replyTo: replyTo,
        threadID: threadID,
        isRepost: isRepost,
        contentLang: "",
        commandTime: currentTimeMillis(),
        commandID: "",
    };
    var ret = await sendCommand(identity, 'Post', post)
    return ret;
}

