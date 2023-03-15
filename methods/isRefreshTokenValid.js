// Core Modules
const path = require("path");

// NPM
const JWT = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

// Models
const user = require(path.join(__dirname, "../resources/users.js"));

// Auth Helper Functions
const isRefreshTokenValid = async function (req, res, next, role) {
    const { cookies: { userRefreshToken, sellerRefreshToken } } = req;

    const { refreshTokenKey, tokenKey, expires } = role === "user" ?
        {
            refreshTokenKey: process.env.UserJWTRefreshTokenSecretKey,
            tokenKey: process.env.UserJWTTokenSecretKey,
            expires: process.env.JWTUserTokenAge
        } :
        {
            refreshTokenKey: process.env.SellerJWTRefreshTokenSecretKey,
            tokenKey: process.env.SellerJWTTokenSecretKey,
            expires: process.env.JWTSellerTokenAge
        }

    if (role === "user" && !userRefreshToken) {
        next(new APIError(400, "Auth Not found"))
        return false;
    };

    if (role === "seller" && !userRefreshToken) {
        next(new APIError(400, "Auth Not found"))
        return false;
    };

    const isValid = JWT.verify(userRefreshToken, refreshTokenKey);

    if (!isValid) return false;

    const isExist = await user.findOne({ email: isValid.email });

    if (!isExist) {
        next(new APIError(404, "User Doesnt Exist"))
        return false;
    };

    const jwt = JWT.sign({
        email: isValid.email
    }, tokenKey, {
        expiresIn: expires
    });

    res.cookie(`${role}Token`, jwt);
    res.locals.cookies = jwt;

    return true;
}

module.exports = isRefreshTokenValid;