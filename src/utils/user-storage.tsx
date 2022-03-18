import { UserInfo } from '../facade/entity';
import { logger } from './logger'

function getUserKey(userID: string) {
  return 'userInfo-' + userID;
}

export function saveLocalUser(userInfo: UserInfo, expireMilli: number) {
  const localStorage = window.localStorage
  try {
    var key = getUserKey(userInfo.userID);
    const item = {
      value: userInfo,
      expire: new Date().getTime() + expireMilli
    }
    localStorage.setItem(key, JSON.stringify(item))
    logger('localStorage-save-userInfo', 'save in localStorage succeed')
  } catch (error) {
    logger('localStorage-save-userInfo', error)
  }
}

export function removeLocalUser(userID: string) {
  const localStorage = window.localStorage
  try {
    var key = getUserKey(userID);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      logger('localStorage-clear-userInfo', 'key clear')
    } else {
      logger('localStorage-clear-userInfo', 'not found: ' + key);
    }
  } catch (error) {
    logger('localStorage-clear-userInfo', error)
  }
}

export function getLocalUser(userID: string) {
  const localStorage = window.localStorage
  try {
    var key = getUserKey(userID);
    const itemstr = localStorage.getItem(key);
    if (!itemstr) {
      return null;
    }
    var item = JSON.parse(itemstr);
    var exp = item.expire;
    if (new Date().getTime() > exp) {
      removeLocalUser(userID);
      return null;
    }
    var ret = item.value as UserInfo;
    return ret;

  } catch (error) {
    logger('localStorage-get-userInfo', error)
    return null;
  }
}
