// Mongoose
const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: [true, "OTP must have a code"]
    },
    email: {
        type: String,
        required: [true, "OTP must have an email Target"]
    },
    type: {
        type: String,
        required: [true, "OTP Must have target type"],
        enum: {
            values: ["User", "Seller"],
            message: "OTP Must  either user or seller type"
        }
    },
    actions: {
        type: String,
        required: [true, "OTP Must have a actions"],
        enum: {
            values: ["delete", "register", "forgotPassword"],
            message: "actions must either delete, register or forgotPassword"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

// Indexes
otpSchema.index({ email: 1, otp: 1 });

// IF otp left for 1 h delete it automaticaly
otpSchema.index(
    {
        createdAt: 1
    },
    {
        expires: "1h"
    }
)

const otp = mongoose.model("OTP", otpSchema);

module.exports = otp;