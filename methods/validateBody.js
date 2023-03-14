/***
 * @param @type data   passed data must in a object form
 * @param length how many data you expect to get
 * @param next
 *  ***/
function validateBody(data, amount, next) {
    if (Object.keys(data).length > amount) {
        next(new APIError(400, "There is more data attached to the body"));
        return true;
    }

    if (Object.keys(data).length < amount) {
        next(new APIError(400, "There is missing data in the body"))
        return true;
    };

    return false;
}

module.exports = validateBody;