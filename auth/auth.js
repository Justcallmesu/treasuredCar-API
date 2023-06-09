// Core Modules
const path = require('path');

// Mongoose
const mongoose = require("mongoose");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));


exports.isObjectId = (req, res, next) => {
    const { params: { _id } } = req;
    if (mongoose.isValidObjectId(_id)) return next();

    return next(new APIError(400, "Invalid Object ID"));
}

exports.logOut = (req, res, next) => {
    res
        .cookie("sellerRefreshToken", "", { sameSite: "none", secure: true })
        .cookie("sellerToken", "", { sameSite: "none", secure: true })
        .cookie("userRefreshToken", "", { sameSite: "none", secure: true })
        .cookie("userToken", "", { sameSite: "none", secure: true })
        .status(200).end();
}