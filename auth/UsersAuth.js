// NPM Modules
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Core Modules
const path = require("path");

// Models
const user = require(path.join(__dirname, "../resources/users.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

// Auth Helper Functions
const isRefreshTokenValid = async function (req, res, next) {
    const { cookies: { userRefreshToken } } = req;

    if (userRefreshToken) return next(new APIError(400, "Auth Not found"));

    const isValid = JWT.verify(userRefreshToken, process.env.JWTRefreshTokenSecretKey);

    if (!isValid) return false;

    const isExist = await user.findOne({ email: isValid.email });

    if (!isExist) return next(new APIError(404, "User Doesnt Exist"));

    const jwt = JWT.sign({
        email: isValid.email
    }, process.env.JWTTokenSecretKey, {
        expiresIn: process.env.JWTUserTokenAge
    });

    res.cookie("userToken", jwt, {
        maxAge: process.env.userTokenCookieMaxAge,
        secure: req.protocol === "https" ? true : false
    });

    return true;
}

exports.isLoggedIn = async function (req, res, next) {
    const { cookies } = req;

    if (cookies) {
        return next(new APIError(400, "Auth Not found"));
    }

    const tokenValid = JWT.verify(token, process.env.JWTTokenSecretKey);

    if (!tokenValid && isRefreshTokenValid(req, res)) {
        return next(new APIError(401, "Token is invalid or Expired Please Relogin"));
    }

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
}