// Mongoose
const mongoose = require("mongoose");

// Schema
const transactionsSchema = mongoose.Schema({
    bookingId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Transactions Must Have BookingId"]
    },
    type: {
        type: String,
        enum: {
            values: ["cash", "credit"],
            message: "Type allowed values is Cash and Credit Only"
        },
        required: [true, "Transactions Must have transactions type"]
    },
    tradeIn: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: {
            values: ["unpaid", "paid"],
            message: "Status values can only unpaid or paid"
        },
        default: "unpaid"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const transactions = mongoose.model("transactions", transactionsSchema);

module.exports = transactions;