import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

/**
 * 
 * @param identity 
 * @param targetType "User" or "Channel"
 * @param targetID userID or channelID
 * @returns 
 */
export async function sendFollow(identity: Identity, targetType: string, targetID: string) {

    var like = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        targetType: targetType,
        targetID: targetID
    };
    var ret = await sendCommand(identity, 'Following', like)
    return ret;
}