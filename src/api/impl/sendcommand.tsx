import { API_ROUTER_CONFIG } from "../config/api-config"
import { logger } from '../../utils/logger'
import { getPrivateKey, randomString, signMessage } from '../../utils/encryption';
import { currentTimeMillis } from '../../utils/date-utils';
import { Identity } from '../../facade/entity';
import { postBazarData } from './BazarHttp';

/**
 * Send command to bazar server. Will set commandID and commandTime inside.
 * @param {*} identityObj 
 * @param {*} commandType 
 * @param {*} model userInfo, userPic, post, like, following, etc. commandID and commandTime will be set in this function
 * @returns 
 */
export async function sendCommand(identityObj: Identity, commandType: string, model: any) {
    model.commandID = randomString(30);
    model.commandTime = currentTimeMillis();
    model.commandType = commandType;
    model.userID = identityObj.userID;
    logger('sendComand_model_' + commandType, model);

    var privateKeyObj = await getPrivateKey(identityObj.privateKey);

    var cmd = {
        commandID: '',
        commandTime: '',
        userID: '',
        commandType: '',
        version: '',
        commandContent: '',
        signature: ''
    };
    cmd.commandID = model.commandID;
    cmd.commandTime = model.commandTime;
    cmd.userID = identityObj.userID;
    cmd.commandType = commandType;
    cmd.version = 'v0.2';
    cmd.commandContent = JSON.stringify(model);
    var signature = await signMessage(privateKeyObj, cmd.commandContent);
    cmd.signature = signature;

    var ret = await postBazarData(API_ROUTER_CONFIG.command, cmd);
    return ret;
}

