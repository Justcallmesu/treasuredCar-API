// Core Modules
const path = require("path");

// NPM
const JWT = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../../class/APIerror.js"));

async function tokenIsValid(userToken, role) {
    const key = role === "user" ? process.env.UserJWTTokenSecretKey : process.env.SellerJWTTokenSecretKey;
    try {
        const tokenValid = await JWT.verify(userToken, key);
        return tokenValid;
    } catch (error) {
        return false;
    }
}

module.exports = tokenIsValid;