import { clearIdentity } from "./identity-storage";

export function handleLogout() {
    clearIdentity();
    window.location.reload();
}

export function getUrlParameter(paramName: string) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === paramName) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}

export function goURL(url: string, refreshMainCourse: any) {
    window.history.pushState('', '', url);
    setTimeout(() => {
        refreshMainCourse();
    }, 50);
}
