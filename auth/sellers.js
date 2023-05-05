// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/auth-methods/sendToken.js"));
const validateBody = require(path.join(__dirname, "../methods/auth-methods/validateBody.js"));
const generateOTP = require(path.join(__dirname, "../methods/OTP/otpGenerator.js"));
const sendEmail = require(path.join(__dirname, "../methods/OTP/emailSender.js"));

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const otp = require(path.join(__dirname, "../resources/OTP.js"));

exports.registerSeller = async function (req, res, next) {
    const { body, user } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please Attach data"));

    if (validateBody(body, 6, next)) return;

    if (body.password != body.confirmPassword) return next(new APIError(400, "Password And Confirm Password Doesnt Match"));

    const isExist = await sellers.findOne({ userId: user._id });

    if (isExist) return next(new APIError(409, "There is already existing store that yours"));

    const storeExist = await sellers.findOne({ email: body.email });

    if (storeExist) return next(new APIError(409, "There is already existing Email"));

    const { _doc: { name, email } } = await sellers.create({ userId: user._id, ...body });

    const otpCode = generateOTP();

    await otp.create({
        otp: otpCode,
        email,
        type: "Seller",
        actions: "register"
    })

    sendEmail({
        email,
        subject: "OTP Code - Dont Share",
        message: `Hello there this is your OTP Code for Registering, it expires after 1 hour be quick : ${otpCode}`
    })

    res.status(201).json(new APIResponse(200, "success", "Account created, OTP sent to the email"));

    // sendToken(req, res, email, new APIResponse(201, "success", "Seller Created Successfully", { name, email }), "seller");
};

exports.loginSeller = async function (req, res, next) {
    const { body } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please Attach data"));

    if (validateBody(body, 2, next)) return;

    if (!"email" in body || !"password" in body) return next(new APIError(400, "Unknown Data"));

    const seller = await sellers.findOne({ email: body.email }).select("+password");

    if (!seller || !seller.isActive) return next(new APIError(400, "Email or Password not Correct"));

    if (!await seller.comparePassword(body.password)) return next(new APIError(400, "Email or Password not Correct"));

    const { name, email } = seller;

    sendToken(req, res, seller.email, new APIResponse(200, "success", "Login Successfully", { name, email }), "seller");
}