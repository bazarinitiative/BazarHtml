import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

export async function sendChannel(identity: Identity, channelID: string, channelName: string, description: string) {

    var channel = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        channelID: channelID,
        channelName: channelName,
        description: description,
    };
    var ret = await sendCommand(identity, 'Channel', channel)
    return ret;
}
