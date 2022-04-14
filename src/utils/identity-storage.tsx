import { Identity } from '../facade/entity'
import { logger } from './logger'

export function saveIdentity(identity: Identity) {
  const localStorage = window.localStorage
  try {
    localStorage.setItem('identity', JSON.stringify(identity))
    logger('localStorage-save-identity', 'identity save in localStorage succeed')
  } catch (error) {
    logger('localStorage-save-identity', error)
  }
}

export function clearIdentity() {
  const localStorage = window.localStorage
  try {
    if (localStorage.getItem('identity') != null) {
      localStorage.removeItem('identity');
      logger('localStorage-clear-identity', 'identity clear')
    }
  } catch (error) {
    logger('localStorage-clear-identity', error)
  }
}

export function getIdentity() {
  const localStorage = window.localStorage
  try {
    const identity = localStorage.getItem('identity');
    if (!identity) {
      return null;
    }
    var ret = JSON.parse(identity) as Identity;
    return ret;

  } catch (error) {
    logger('localStorage-get-identity', error)
    return null;
  }
}

export function saveExtendIdentity(identity: Identity[]) {
  const localStorage = window.localStorage
  try {
    localStorage.setItem('extendidentity', JSON.stringify(identity))
    logger('localStorage-save-identity', 'identity save in localStorage succeed')
  } catch (error) {
    logger('localStorage-save-extidentity', error)
  }
}

export function getExtendIdentity() {
  const localStorage = window.localStorage
  try {
    const str = localStorage.getItem('extendidentity');
    if (!str) {
      return null;
    }
    var ret = JSON.parse(str) as Identity[];
    return ret;

  } catch (error) {
    logger('localStorage-get-extidentity', error)
    return null;
  }
}
