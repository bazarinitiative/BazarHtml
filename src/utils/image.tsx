import { logger } from "./logger"

/**
 * 
 * @param img create by new Image()
 * @param type 
 * @param mx 
 * @param mh 
 * @returns dataUrl
 */
export function compressImg(img: any, type: string | null, mx: number, mh: number) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context == null) {
        return
    }
    const { width: originWidth, height: originHeight } = img

    logger('compressImg_src', originWidth + '-' + originHeight)

    // max size
    const maxWidth = mx
    const maxHeight = mh
    // target size
    let targetWidth = originWidth
    let targetHeight = originHeight
    if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > 1) {
            // wide image
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
            // tall image
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
    }
    canvas.width = targetWidth
    canvas.height = targetHeight
    context.clearRect(0, 0, targetWidth, targetHeight)
    // draw img
    context.drawImage(img, 0, 0, targetWidth, targetHeight)
    // canvas.toBlob(function (blob) {
    //     resolve(blob)
    // }, type || 'image/png')
    var ss = canvas.toDataURL()
    return ss;
}

export async function refreshImg(url: string) {
    var headers = new Headers()
    headers.append('pragma', 'no-cache')
    headers.append('cache-control', 'no-cache')

    var init = {
        method: 'GET',
        headers: headers,
        mode: ('no-cors' as RequestMode),
        cache: ('no-cache' as RequestCache),
    }

    await fetch(new Request(url), init)
} 
