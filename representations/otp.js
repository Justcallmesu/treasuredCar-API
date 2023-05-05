// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

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

const sellerMethod = {
    register: async (email) => {
        await sellers.updateOne({ email }, { isActive: true });
    },
    delete: async (email) => {
        await sellers.deleteOne({ email });
    }
}

exports.findOtp = async (req, res, next) => {
    if (!req.body) return next(new APIError(400, "Body Must not Empty"));

    const { email, otpCode, type } = req.body;

    if (!email || !otpCode || !type) return next(new APIError(400, "Missing Data"));

    if (type !== "User" && type !== "Seller") return next(new APIError(400, "Invalid Type"));

    const data = await otp.findOne({ email, otp: otpCode, type }).lean();

    if (!data) return next(new APIError(401, "OTP may invalid"));

    if (data.actions === "forgotPassword") {
        return res.status(200).json(new APIResponse(200, "success", "OTP Match"));
    }

    if (type === "User") userMethod[data.actions](email);
    if (type === "Seller") sellerMethod[data.actions](email);

    await otp.deleteOne({ _id: data._id })

    res.status(200).json(new APIResponse(200, "success", "OTP Match"));
}