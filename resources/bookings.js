// Mongoose
const mongoose = require("mongoose");

// Schema
const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Booking must have a User"],
        refs: "users"
    },
    carId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Booking must have a Car"],
        refs: "cars"
    },
    transactionId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Booking must have a Transactions"],
        refs: "transactions"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: {
            values: ["Undelivered", "Delivered"],
            message: "Values only can either Undelivered or Delivered"
        },
        required: [true, "Bookings must have a status"],
        default: "Undelivered"
    },
    total: {
        type: Number,
        required: [true, "Booking must have a total price"]
    }
});

const bookings = mongoose.model("bookings", bookingSchema);

module.exports = bookings;