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
        .cookie("sellerRefreshToken", "")
        .cookie("sellerToken", "")
        .cookie("userRefreshToken", "")
        .cookie("userToken", "")
        .status(200).end();
}