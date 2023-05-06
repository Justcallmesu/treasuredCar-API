// NPm Modules
const path = require("path");
const isRefreshTokenValid = require("../methods/auth-methods/isRefreshTokenValid");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

// Models
const users = require(path.join(__dirname, "../resources/users.js"));
const otp = require(path.join(__dirname, "../resources/OTP.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/auth-methods/sendToken.js"));
const validateBody = require(path.join(__dirname, "../methods/auth-methods/validateBody.js"));
const generateOTP = require(path.join(__dirname, "../methods/OTP/otpGenerator.js"));
const sendEmail = require(path.join(__dirname, "../methods/OTP/emailSender.js"));


exports.login = async function (req, res, next) {
    const { body } = req;
    if (!body) return next(new APIError(400, "Please attach a data"));

    if (validateBody(body, 2, next)) return;

    if (!("email" in body) || !("password" in body)) return next(new APIError(400, "There is unknown data attached to the body"));

    if (body.password.length < 8) return next(new APIError(400, "Password Length must 8 or more characters"));

    const foundUser = await users.findOne({ email: body.email }).select("+password");

    if (!foundUser || !foundUser?.isActive) return next(new APIError(400, "Your email or password is incorrect"));

    if (!(await foundUser.comparePassword(body.password))) return next(new APIError(400, "Your email or password is incorrect"));

    sendToken(req, res, body.email, new APIResponse(200, "success", "login Successfully"), "user");
};


exports.register = async function (req, res, next) {
    const { body } = req;
    if (!body) return next(new APIError(400, "Please attach a data"));

    if (validateBody(body, 4, next)) return;

    if (!("email" in body) || !("name" in body) || !("confirmPassword" in body) || !("password" in body)) {
        return next(new APIError(400, "There is unknown data attached to the body"));
    }

    if (body.password !== body.confirmPassword) return next(new APIError(400, "Password And confirm password doesnt match"));

    if (body.password.length < 8 && body.confirmPassword.lenth < 8) return next(new APIError(400, "Password Length must 8 or more characters"));

    const isEmailExist = await users.findOne({ email: body.email });

    if (isEmailExist) return next(new APIError(409, "Email already used !"));

    const { email } = await users.create(body);

    const otpCode = generateOTP();

    await otp.create({
        otp: otpCode,
        email,
        type: "User",
        actions: "register"
    })

    sendEmail({
        email,
        subject: "OTP Code - Dont Share",
        message: `Hello there this is your OTP Code for Registering, it expires after 1 hour be quick : ${otpCode}`
    })

    res.status(201).json(new APIResponse(200, "success", "Account created, OTP sent to the email"));
}

exports.forgotPassword = async function (req, res, next) {
    const { body } = req;

    if (!("email" in body)) return next(new APIError(400, "Missing Data: Email must included"));

    const otpCode = generateOTP();

    await otp.create({
        otp: otpCode,
        email: body.email,
        type: "User",
        actions: "forgotPassword"
    })

    await sendEmail({
        email: body.email,
        subject: "OTP Code - Dont Share",
        message: `Hello there this is your OTP Code for Forgot Password, it expires after 1 hour be quick : ${otpCode}`
    })

    res.status(201).json(new APIResponse(200, "success", "Forgot Password, OTP sent to the email"));
}

exports.changePassword = async (req, res, next) => {
    const { body } = req;

    if (!("email" in body) || !("otpCode" in body) || !("password" in body) || !("confirmPassword" in body)) return next(new APIError(400, "Missing Data"));

    const { email, otpCode, password, confirmPassword } = body;

    const foundOTP = await otp.findOne({ email, otp: otpCode, type: "User" }).lean();

    if (!foundOTP) return next(new APIError(401, "OTP May Invalid"));

    if (password.length < 8 || confirmPassword.length < 8) return next(new APIError(400, "Password must 8 character or more"));

    if (password !== confirmPassword) return next(new APIError(400, "Password Doesnt match with Confirm Password"))

    const foundUser = await users.findOne({ email });

    if (!foundUser) return next(new APIError(404, "User not Found"));

    foundUser.password = password;

    await foundUser.save();

    await otp.deleteOne({ _id: foundOTP._id })

    res.status(201).json(new APIResponse(201, "success", "Password Changed"));
}

exports.getCredentials = async function (req, res, next) {
    await isRefreshTokenValid(req, res, next, "user");
    res.status(200).end();
}