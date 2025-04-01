const pick = (obj, keys) => {
    return keys.reduce((acc, key) => {
        if (obj && key in obj) {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
};
export default pick;
