// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

function constructError(err) {
    console.log(err);
    if (err.type === "entity.parse.failed") return new APIError(400, "Invalid JSON Data");
    if (err.name === 'TokenExpiredError') return new APIError(401, "Session Expired Please Relogin");
    if (err.code === 11000) return new APIError(401, "Duplicate Data");
}

function productionErrorHandler(err, req, res, next) {
    let error = err;
    if (!(err instanceof APIError)) error = constructError(err);
    return res.status(error.statusCode).json(error);
};

module.exports = function (err, req, res, next) {
    if (process.env.NODE_ENV === "production") return productionErrorHandler(err, req, res, next);
    console.log(err);
    return res.status(400).json(err);
}