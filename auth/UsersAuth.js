// NPM Modules
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

exports.isTokenValid = function (req, res, next) {
    const { cookies: { token } } = req;
    if (cookies) {
        return next(new APIError(400, "Auth Not found"));
    }

    const isValid = JWT.verify(token, process.env.JWTSecretKey);
    console.log(isValid);
    if (!isValid) {
        return next(new APIError(401, "Token is invalid or Expired"));
    }

    next();
};

exports.isRefreshTokenExpired = function (req, res, next) {
    const { cookies: { refreshToken } } = req;
    if (cookies) {
        return next(new APIError(400, "Auth Not found"));
    }

    const isValid = JWT.verify(token, process.env.JWTSecretKey);

    if (!isValid) {
        return next(new APIError(401, "Token is invalid or Expired"));
    }

    next();
}