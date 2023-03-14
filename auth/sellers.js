// Core Modules
const jwt = require("jsonwebtoken");
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/sendToken.js"));
const sendCookies = require(path.join(__dirname, "../methods/sendCookies.js"));
const validateBody = require(path.join(__dirname, "../methods/validateBody.js"));

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const users = require(path.join(__dirname, "../resources/users.js"));

exports.registerSeller = async function (req, res, next) {
    const { body, user } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please Attach data"));

    if (validateBody(body, 4, next)) return;

    if (body.password != body.confirmPassword) return next(new APIError(400, "Password And Confirm Password Doesnt Match"));

    const isExist = await sellers.findOne({ userId: user._id });

    if (isExist) return next(new APIError(409, "There is already existing store that yours "));

    const { _doc: { name, email } } = await sellers.create({ userId: user._id, ...body });


    res.status(200).json(new APIResponse(201, "success", "Seller Created Successfully", { name, email })).end();
}