import { UserDto } from '../facade/entity';
import { logger } from './logger'

function getUserKey(userID: string) {
  return 'userDto-' + userID;
}

export function saveLocalUser(dto: UserDto, expireMilli: number) {
  const localStorage = window.localStorage
  try {
    var key = getUserKey(dto.userID);
    const item = {
      value: dto,
      expire: new Date().getTime() + expireMilli
    }
    localStorage.setItem(key, JSON.stringify(item))
    // logger('localStorage-save-userDto', 'save in localStorage succeed')

    if (localStorage.length % 10 === 0) {
      // var remove = 0;
      for (let index = 0; index < localStorage.length; index++) {
        var kk = localStorage.key(index)
        if (kk) {
          const itemstr = localStorage.getItem(kk);
          if (itemstr) {
            var one = JSON.parse(itemstr);
            if (new Date().getTime() > one.expire) {
              localStorage.removeItem(kk);
              // remove++;
            }
          }
        }
      }
      // logger('localStorage-remove', `remove:${remove}, remain:${localStorage.length}`);
    }
  } catch (error) {
    logger('localStorage-save-userDto', error)
  }
}

export function removeLocalUser(userID: string) {
  const localStorage = window.localStorage
  try {
    var key = getUserKey(userID);
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      logger('localStorage-clear-userDto', 'key clear')
    } else {
      logger('localStorage-clear-userDto', 'not found: ' + key);
    }
  } catch (error) {
    logger('localStorage-clear-userDto', error)
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
    var ret = item.value as UserDto;
    return ret;

  } catch (error) {
    logger('localStorage-get-userDto', error)
    return null;
  }
}
