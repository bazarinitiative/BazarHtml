import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

export async function sendChannelMember(identity: Identity, channelID: string, memberID: string) {

    var channel = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        channelID: channelID,
        memberID: memberID,
    };
    var ret = await sendCommand(identity, 'ChannelMember', channel)
    return ret;
}
