// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Model
const otp = require(path.join(__dirname, "../resources/OTP.js"));
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const users = require(path.join(__dirname, "../resources/users.js"));

// const method 
const userMethod = {
    register: async (email) => {
        await users.updateOne({ email }, { isActive: true });
    },
    delete: async (email) => {
        await users.deleteOne({ email });
    }
}



exports.findOtp = async (req, res, next) => {
    if (!req.body) return next(new APIError(400, "Body Must not Empty"));

    const { email, otpCode } = req.body;

    const data = await otp.findOne({ email, otp: otpCode }).lean();

    if (!data) return next(new APIError(401, "OTP may invalid"));

    if (data.type === "User") userMethod[data.actions](email);

    res.status(200).json(new APIResponse(200, "success", "OTP Match"));
}