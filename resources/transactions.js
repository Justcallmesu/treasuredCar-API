// Mongoose
const mongoose = require("mongoose");

// Schema
const transactionsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Transactions must have a user"],
        ref: "users"
    },
    carId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Transactions must have a car"],
        ref: "cars"
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

// Index
transactionsSchema.index(
    {
        userId: 1,
        carId: 1
    },
    {
        unique: true
    });

transactionsSchema.index(
    {
        createdAt: 1
    }, {
    expires: "1d",
    partialFilterExpression: {
        status: {
            $eq: "unpaid"
        }
    }
})

const transactions = mongoose.model("transactions", transactionsSchema);

module.exports = transactions;