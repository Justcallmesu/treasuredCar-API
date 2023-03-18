// Mongoose
const mongoose = require("mongoose");

// Schema
const transactionsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Transactions must have a user"]
    },
    carId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Transactions must have a car"]
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