// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

function productionErrorHandler(err, req, res, next) {
    if (err.type === "entity.parse.failed") return res.status(err.statusCode).json(new APIError(400, "Invalid JSON Data"));
}

module.exports = function (err, req, res, next) {
    if (process.env.NODE_ENV === "production") return productionErrorHandler(err, req, res, next);
    return res.status(err.statusCode).json(err);
}