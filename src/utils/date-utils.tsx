
/**
 * 
 * @param timestamp in seconds or milliseconds 
 * @returns 
 */
export function formatRelativeTime(timestamp: number) {
    if (timestamp < max_int32) {
        timestamp = timestamp * 1000;
    }
    return getDateDiff(new Date(timestamp).getTime())
}

function getDateDiff(timeMillis: number) {
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let month = day * 30

    let now = new Date().getTime()
    let diffValue = now - timeMillis
    if (diffValue < 0) { return }
    let monthC = diffValue / month
    let weekC = diffValue / (7 * day)
    let dayC = diffValue / day
    let hourC = diffValue / hour
    let minC = diffValue / minute
    let result = ""
    if (monthC >= 1) {
        result = "" + parseInt(monthC.toString(), 10) + "months";
    }
    else if (weekC >= 1) {
        result = "" + parseInt(weekC.toString(), 10) + "weeks";
    }
    else if (dayC >= 1) {
        result = "" + parseInt(dayC.toString(), 10) + "days";
    }
    else if (hourC >= 1) {
        result = "" + parseInt(hourC.toString(), 10) + "hours";
    }
    else if (minC >= 1) {
        result = "" + parseInt(minC.toString(), 10) + "minutes";
    } else {
        result = "recently";
    }
    return result;
}

/**
 * milliseconds since epoch
 * @returns 
 */
export function currentTimeMillis() {
    var timestamp = Number(BigInt(new Date().getTime()));
    return timestamp;
}

var max_int32 = 0x80000000;

/**
 * to local string
 * @param {*} timestamp in seconds or milliseconds
 * @returns datetime string
 */
export function getLocalTime(timestamp: number) {
    if (timestamp < max_int32) {
        timestamp = timestamp * 1000;
    }
    return new Date(timestamp).toLocaleString("en-US", { hour12: false }).replace(/:\d{1,2}$/, ' ');
}


