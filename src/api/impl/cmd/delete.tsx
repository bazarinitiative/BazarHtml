import { Identity } from "../../../facade/entity";
import { currentTimeMillis } from "../../../utils/date-utils";
import { sendCommand } from "../sendcommand";

export async function sendDelete(identity: Identity, deleteType: string, targetID: string) {

    var deleteCmd = {
        userID: identity.userID,
        commandTime: currentTimeMillis(),
        deleteType: deleteType,
        targetID: targetID,
    };
    var ret = await sendCommand(identity, 'Delete', deleteCmd)
    return ret
}

