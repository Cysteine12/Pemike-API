const exclude = (obj, keys) => {
    keys.forEach((key) => {
        delete obj[key];
    });
    return obj;
};
export default exclude;
