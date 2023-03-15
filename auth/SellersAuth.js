// NPM Modules
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

// Core Modules
const path = require("path");

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));

// Methods
const isRefreshTokenValid = require(path.join(__dirname, "../methods/sendCookies.js"));
const tokenIsValid = require(path.join(__dirname, "../methods/validateToken.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

// Functions
exports.isSeller = async function (req, res, next) {
    const { cookies: { sellerRefreshToken, sellerToken } } = req;

    if (!sellerRefreshToken) return next(new APIError(400, "Auth not found"));

    !sellerToken && isRefreshTokenValid(req, res, next, "seller");

    const tokenValid = tokenIsValid(res.locals?.cookies || userToken);

    if (!tokenIsValid) return;

    const founduser = await sellers.findOne({ email: tokenValid.email });

    if (!founduser) return next(new APIError(404, "Your data doesnt exist please Relogin"));

    req.user = founduser;

    next();
}