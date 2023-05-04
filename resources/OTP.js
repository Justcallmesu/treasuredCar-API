// Mongoose
const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
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
    }
})

// Indexes
otpSchema.index({ email: 1 });

const otp = mongoose.model("OTP", otpSchema);

module.exports = otp;