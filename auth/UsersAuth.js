// NPM Modules
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Core Modules
const path = require("path");

// Models
const user = require(path.join(__dirname, "../resources/users.js"));
const isRefreshTokenValid = require(path.join(__dirname, "../methods/sendCookies.js"));

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

exports.isLoggedIn = async function (req, res, next) {
    const { cookies: { userToken, userRefreshToken } } = req;

    if (!userToken && !userRefreshToken) {
        return next(new APIError(400, "Auth Not found"));
    }

    !userToken && await isRefreshTokenValid(req, res, next);
    const tokenValid = tokenIsValid(res.locals?.cookies || userToken);

    if (!tokenIsValid) return;

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