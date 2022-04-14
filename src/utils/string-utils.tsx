
import emoji from 'node-emoji'

export const getUrlKey = (key: any) => {
    return (
        decodeURIComponent(
            // eslint-disable-next-line no-useless-concat
            ((new RegExp("[?|&]" + key + "=" + "([^&;]+?)(&|#|;|$)").exec(
                // eslint-disable-next-line no-restricted-globals
                location.href
                // eslint-disable-next-line no-sparse-arrays
            ) || [, ""]) as any)[1].replace(/\+/g, "%20")
        ) || null
    );
}

export const formatImgThumb = (img: any) => {

    let format = img.replace('thumbnail', 'thumb180');
    format = format.replace('wx1', 'wx3')
    return format
}

export const formatImgMiddle = (img: any) => {

    let format = img.replace('thumbnail', 'bmiddle');
    return format
}

export const formatNum = (num: any) => {
    let result
    if (num > 999) {
        if (num > 9999) {
            result = "9k+"
        } else {
            result = Math.round(num / 1000) + "k+"
        }
    } else {
        result = num
    }
    return result;
}

export function htmlDecode(input: string) {
    var ss = emoji.emojify(input)
    var doc = new DOMParser().parseFromString(ss, "text/html");
    return doc.documentElement.textContent;
}

