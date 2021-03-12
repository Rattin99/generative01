export const defaultValue = (obj, key, value) => (obj.hasOwnProperty(key) ? obj[key] : value);

const limitArrayLen = (arr) => {
    const arrLength = arr.length;
    if (arrLength > MAX_COORD_HISTORY) {
        arr.splice(0, arrLength - MAX_COORD_HISTORY);
    }
    return arr;
};
