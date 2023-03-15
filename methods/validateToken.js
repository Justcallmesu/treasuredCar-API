// Core Modules
const path = require("path");

// NPM
const JWT = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

function tokenIsValid(userToken) {
    const tokenValid = JWT.verify(userToken, process.env.UserJWTTokenSecretKey);

    if (!tokenValid) {
        next(new APIError(401, "Your token may invalid or Expired Please Relogin"));
        return false;
    }
    return tokenValid;
}

module.exports = tokenIsValid;