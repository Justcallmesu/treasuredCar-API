// Core Modules
const path = require("path");

// NPM
const JWT = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../../class/APIerror.js"));

function tokenIsValid(userToken, role) {
    const key = role === "user" ? process.env.UserJWTTokenSecretKey : process.env.SellerJWTTokenSecretKey;
    const tokenValid = JWT.verify(userToken, key);

    if (!tokenValid) {
        next(new APIError(401, "Your token may invalid or Expired Please Relogin"));
        return false;
    }
    return tokenValid;
}

module.exports = tokenIsValid;