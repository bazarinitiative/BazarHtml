export const logger = (tag: string | null, message: any) => {
    if (typeof message === 'object') {
        console.log(tag + ":" + JSON.stringify(message));
    } else {
        console.log(tag + ":" + message);
    }
}