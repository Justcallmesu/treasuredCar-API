// Core Modules
const path = require("path");

// Models
const users = require(path.join(__dirname, "../resources/users.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

exports.updateMyUser = async (req, res, next) => {
    const { body, user } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please attach a data"));

    const { name, email } = body;

    let query = !req.photo ? { name, email } : { name, email, photo: req.photo };

    const { name: userName, email: userEmail, photo } = await users.findOneAndUpdate({ _id: user._id }, query, { new: true }).lean();

    res.status(200).json(new APIResponse(201, "success", "Updated Successfully", { user: { userName, userEmail, photo } }));
};

exports.deleteMyUser = async (req, res, next) => {
    const { user: { email } } = req;

    const otpCode = generateOTP();

    await otp.create({
        otp: otpCode,
        email,
        type: "User",
        actions: "delete"
    })

    sendEmail({
        email,
        subject: "OTP Code - Dont Share",
        message: `Hello there this is your OTP Code for Delete Account, it expires after 1 hour be quick : ${otpCode}`
    })

    res.status(200).json(new APIResponse(200, "success", "Account On Delete, OTP sent to the email"));
}

exports.changeMyPassword = async (req, res, next) => {
    const { user, body } = req;

    if (!body) return next(new APIError(400, "Please attach a data"));

    const { password, confirmPassword, oldPassword } = body;

    if (!password || !confirmPassword || !oldPassword) return next(new APIError(400, "Missing data"));

    const foundUser = await users.findOne({ _id: user._id }).select("+password");

    if (!await foundUser.comparePassword(oldPassword)) return next(new APIError(401, "Wrong Password"));

    if (body.password !== body.confirmPassword) return next(new APIError(400, "Password And confirm password doesnt match"));

    if (body.password.length < 8 && body.confirmPassword.lenth < 8) return next(new APIError(400, "Password Length must 8 or more characters"));

    foundUser.password = password;

    await foundUser.save();

    res.status(201).json(new APIResponse(200, "success", "Password Changed"));

}

exports.getUser = async (req, res, next) => {
    const { user } = req;

    if (!user) return next(new APIError(404, "No User Found"));

    res.status(200).json(new APIResponse(200, "success", "fetched successfully", user));
}