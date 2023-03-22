// Core Modules
const path = require("path");

// NPM Modules
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/sendToken.js"));
const isRefreshTokenValid = require(path.join(__dirname, "../methods/isRefreshTokenValid.js"));
const validateBody = require(path.join(__dirname, "../methods/validateBody.js"));

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const users = require(path.join(__dirname, "../resources/users.js"));


exports.checkCookies = async (socket, next) => {
    if (!socket.handshake.headers?.cookie) {
        return next(new APIError(400, "not Logged in"));
    }

    const { userRefreshToken } = cookie.parse(socket.handshake.headers.cookie);

    if (userRefreshToken) {
        const { email } = jwt.verify(userRefreshToken, process.env.UserJWTRefreshTokenSecretKey);
        const data = await users.findOne({ email });
        socket.handshake.auth = { ...socket.handshake.auth, userId: data._id.toString() };
        data.socketId = socket.id;
        await data.save({ validateBeforeSave: false });
    }

    next();
}

exports.disconnected = async (socket, next) => {
    const { userId } = socket.handshake.auth;

    const foundUser = await users.findOne({ _id: userId });
    if (foundUser) {
        foundUser.socketId = null;
        await foundUser.save();
    }
}