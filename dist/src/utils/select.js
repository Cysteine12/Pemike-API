const select = (keys) => {
    if (!keys)
        return undefined;
    return keys.reduce((acc, key) => {
        acc[key] = true;
        return acc;
    }, {});
};
export default select;
