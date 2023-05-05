// Core Modules
const path = require("path");

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));
const otp = require(path.join(__dirname, "../resources/OTP.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

// Methods
const generateOTP = require(path.join(__dirname, "../methods/OTP/otpGenerator.js"));
const sendEmail = require(path.join(__dirname, "../methods/OTP/emailSender.js"));

exports.updateMySeller = async (req, res, next) => {
    const { body, seller } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please attach a data"));

    const { name, email, phoneNumber } = body;

    let query = !req.photo ? { name, email, phoneNumber } : { name, email, phoneNumber, photo: req.photo };

    const { name: sellerName, email: sellerEmail, photo } = await sellers.findOneAndUpdate({ _id: seller._id }, query, { new: true }).lean();

    res.status(200).json(new APIResponse(201, "success", "Updated Successfully", { seller: { sellerName, sellerEmail, photo } }));
};

exports.deleteMySeller = async (req, res, next) => {
    const { seller } = req;

    const otpCode = generateOTP();

    await otp.create({
        otp: otpCode,
        email: seller.email,
        type: "Seller",
        actions: "delete"
    })

    sendEmail({
        email: seller.email,
        subject: "OTP Code - Dont Share",
        message: `Hello there this is your OTP Code for Delete, it expires after 1 hour be quick : ${otpCode}`
    })

    res.status(200).json(new APIResponse(200, "success", "Account On Delete, OTP sent to the email"));
}

exports.getSeller = async (req, res, next) => {
    const { params } = req;

    const sellerData = await sellers.findOne({ _id: params._id }).select("-passwordChangedAt -infoChangeCooldown").lean();

    if (!sellerData) return next(new APIError(404, "No Seller Found"));

    res.status(200).json(new APIResponse(200, "success", "fetched successfully", sellerData));
}

exports.getMySeller = async (req, res, next) => {
    const { seller } = req;
    console.log(req);
    if (!seller) return next(new APIError(404, "No Seller Found"));

    res.status(200).json(new APIResponse(200, "success", "fetched successfully", seller));
}