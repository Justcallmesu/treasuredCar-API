// Core Modules
const path = require("path");

// NPM
const JWT = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

// Models
const user = require(path.join(__dirname, "../resources/users.js"));

// Auth Helper Functions
const isRefreshTokenValid = async function (req, res, next) {
    const { cookies: { userRefreshToken } } = req;

    if (!userRefreshToken) {
        next(new APIError(400, "Auth Not found"))
        return false;
    };

    const isValid = JWT.verify(userRefreshToken, process.env.UserJWTRefreshTokenSecretKey);

    if (!isValid) return false;

    const isExist = await user.findOne({ email: isValid.email });

    if (!isExist) {
        next(new APIError(404, "User Doesnt Exist"))
        return false;
    };

    const jwt = JWT.sign({
        email: isValid.email
    }, process.env.UserJWTTokenSecretKey, {
        expiresIn: process.env.JWTUserTokenAge
    });

    res.cookie("userToken", jwt);
    res.locals.cookies = jwt;

    return true;
}

module.exports = isRefreshTokenValid;