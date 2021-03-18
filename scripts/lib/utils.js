export const defaultValue = (obj, key, value) => (obj.hasOwnProperty(key) ? obj[key] : value);

export const first = (arry) => arry[0];
export const middle = (arry) => arry.slice(1, arry.length - 2);
export const last = (arry) => arry[arry.length - 1];

export const limitArrayLen = (arr) => {
    const arrLength = arr.length;
    if (arrLength > MAX_COORD_HISTORY) {
        arr.splice(0, arrLength - MAX_COORD_HISTORY);
    }
    return arr;
};
