export const defaultValue = (obj, key, value) => (obj.hasOwnProperty(key) ? obj[key] : value);

export const first = (arry) => arry[0];
export const middle = (arry) => arry.slice(1, arry.length - 2);
export const last = (arry) => arry[arry.length - 1];

export const limitArrayLen = (max, arr) => {
    const arrLength = arr.length;
    if (arrLength > max) {
        arr.splice(0, arrLength - max);
    }
    return arr;
};

export const getArrayValuesFromStart = (arr, start, len) => {
    const values = [];
    let index = start;
    for (let i = 0; i < len; i++) {
        values.push(arr[index--]);
        if (index < 0) index = arr.length - 1;
    }
    return values;
};

// Just getting an index by wrapping can be done w/ % https://benfrain.com/looping-infinitely-around-an-array-in-javascript/
export const getArrayValuesFromEnd = (arr, start, len) => {
    const values = [];
    let index = start;
    for (let i = 0; i < len; i++) {
        values.push(arr[index++]);
        if (index === arr.length) index = 0;
    }
    return values;
};

export const averageNumArray = (arry) => arry.reduce((a, b) => a + b) / arry.length;

export const lowest = (arry) =>
    arry.reduce((acc, v) => {
        if (v < acc) {
            acc = v;
        }
        return acc;
    }, 0);

export const highest = (arry) =>
    arry.reduce((acc, v) => {
        if (v > acc) {
            acc = v;
        }
        return acc;
    }, 0);

export const getQueryVariable = (variable) => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
};
