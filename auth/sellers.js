// Core Modules
const jwt = require("jsonwebtoken");
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/auth-methods/sendToken.js"));
const isRefreshTokenValid = require(path.join(__dirname, "../methods/auth-methods/isRefreshTokenValid.js"));
const validateBody = require(path.join(__dirname, "../methods/auth-methods/validateBody.js"));

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const users = require(path.join(__dirname, "../resources/users.js"));

exports.registerSeller = async function (req, res, next) {
    const { body, user } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please Attach data"));

    if (validateBody(body, 4, next)) return;

    if (body.password != body.confirmPassword) return next(new APIError(400, "Password And Confirm Password Doesnt Match"));

    const isExist = await sellers.findOne({ userId: user._id });

    if (isExist) return next(new APIError(409, "There is already existing store that yours"));

    const { _doc: { name, email } } = await sellers.create({ userId: user._id, ...body });
    sendToken(req, res, email, new APIResponse(201, "success", "Seller Created Successfully", { name, email }), "seller");
};

exports.loginSeller = async function (req, res, next) {
    const { body } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please Attach data"));

    if (validateBody(body, 2, next)) return;

    if (!"email" in body || !"password" in body) return next(new APIError(400, "Unknown Data"));

    const seller = await sellers.findOne({ email: body.email }).select("+password");

    if (!seller) return next(new APIError(400, "Email or Password not Correct"));

    if (!await seller.comparePassword(body.password)) return next(new APIError(400, "Email or Password not Correct"));

    const { name, email } = seller;

    sendToken(req, res, seller.email, new APIResponse(200, "success", "Login Successfully", { name, email }), "seller");
}