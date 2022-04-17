import { clearIdentity, saveExtendIdentity } from "./identity-storage";

export function handleLogout() {
    clearIdentity();
    saveExtendIdentity([])
    window.location.reload();
}

/**
 * 
 * @param paramName 
 * @returns will return '' if not exist
 */
export function getUrlParameter(paramName: string) {
    var queryStr = window.location.search.substring(1);
    var sURLVariables = queryStr.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === paramName) {
            return sParameterName[1] === undefined ? '' : decodeURI(sParameterName[1]);
        }
    }
    return '';
}

export function goURL(url: string, refreshMainCourse: any) {
    window.history.pushState('', '', url);
    setTimeout(() => {
        refreshMainCourse();
    }, 50);
}

export function getWindowWidth() {
    var windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    return windowWidth
}

export function isMobile() {
    return getWindowWidth() < 1000;
}

