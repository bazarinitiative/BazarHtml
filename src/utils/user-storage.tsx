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

////////////////////////////////////////////////////////////////////////////
// Pic

function getPicKey(userID: string) {
  return 'userPic-' + userID;
}

export function saveLocalPic(userID: string, picstr: string, expireMilli: number) {
  const localStorage = window.localStorage
  try {
    var key = getPicKey(userID);
    const item = {
      value: picstr,
      expire: new Date().getTime() + expireMilli
    }
    localStorage.setItem(key, JSON.stringify(item))
    logger('localStorage-save-userPic', 'save in localStorage succeed')
  } catch (error) {
    logger('localStorage-save-userPic', error)
  }

  if (localStorage.length % 10 === 0) {
    var remove = 0;
    for (let index = 0; index < localStorage.length; index++) {
      var kk = localStorage.key(index)
      if (kk) {
        const itemstr = localStorage.getItem(kk);
        if (itemstr) {
          var item = JSON.parse(itemstr);
          if (new Date().getTime() > item.expire) {
            localStorage.removeItem(kk);
            remove++;
          }
        }
      }
    }
    logger('localStorage-remove', `remove:${remove}, remain:${localStorage.length}`);
  }
}

export function removeLocalPic(userID: string) {
  const localStorage = window.localStorage
  try {
    var key = getPicKey(userID);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      logger('localStorage-clear-userPic', 'key clear')
    } else {
      logger('localStorage-clear-userPic-' + userID, 'not found: ' + key);
    }
  } catch (error) {
    logger('localStorage-clear-userPic', error)
  }
}

/**
 * 
 * @param userID 
 * @returns picstr in base64 format
 */
export function getLocalPic(userID: string) {
  const localStorage = window.localStorage
  try {
    var key = getPicKey(userID);
    const itemstr = localStorage.getItem(key);
    if (!itemstr) {
      return '';
    }
    var item = JSON.parse(itemstr);
    if (new Date().getTime() > item.expire) {
      removeLocalPic(userID);
      return '';
    }
    return item.value as string;

  } catch (error) {
    logger('localStorage-get-userPic', error)
    return '';
  }
}
