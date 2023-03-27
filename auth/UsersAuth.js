// NPM Modules
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Core Modules
const path = require("path");

// Models
const user = require(path.join(__dirname, "../resources/users.js"));

// Methods
const isRefreshTokenValid = require(path.join(__dirname, "../methods/auth-methods/isRefreshTokenValid.js"));
const tokenIsValid = require(path.join(__dirname, "../methods/auth-methods/validateToken.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

exports.isLoggedIn = async function (req, res, next) {
    const { cookies: { userToken, userRefreshToken } } = req;

    if (!userRefreshToken) return next(new APIError(400, "Auth Not found"));


    if (!userToken && !await isRefreshTokenValid(req, res, next, "user")) return;

    const tokenValid = tokenIsValid(res.locals?.cookies || userToken, "user");

    if (!tokenIsValid && !await isRefreshTokenValid(req, res, next, "user")) return;

    const founduser = await user.findOne({ email: tokenValid.email });

    if (!founduser) return next(new APIError(404, "Your data doesnt exist please Relogin"));

    req.user = founduser;

    next();
};

exports.allowedRoles = function (roles) {
    return (req, res, next) => {
        const { user } = req;
        if (!roles.includes(user.role)) {
            return next(new APIError(401, "You are not permissioned to do this"))
        }
        next();
    }
};