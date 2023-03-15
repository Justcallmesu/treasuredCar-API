// Mongoose
const mongoose = require("mongoose");

// Schema
const taxSchema = mongoose.Schema({
    PKBPokok: {
        type: Number,
        required: [true, "Car must have a PKBPokok"]
    },
    PKBDenda: {
        type: Number,
        default: 0
    },
    SWDKLLJPokok: {
        type: Number,
        default: 0
    },
    SWDKLLJDenda: {
        type: Number,
        default: 0
    },
    dendaTaxTotal: {
        type: Number,
    },
    pokokTaxTotal: {
        type: Number,
    }
})

const locationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: {
            values: ["Point"],
            message: "type can only be in the form of Points"
        },
        default: "Point",
        required: [true, "type must be filled"]
    },
    coordinates: [Number]
})

const carsSchema = mongoose.Schema({
    sellerId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Car must have a seller Id"],
        ref: "sellers"
    },
    name: {
        type: String,
        required: [true, "Car must have a name"]
    },
    cc: {
        type: String,
        required: [true, "Car must have a cc"]
    },
    tax: taxSchema,
    plateNumber: {
        type: String,
        required: [true, "Car must have plate Number"]
    },
    brand: {
        type: String,
        required: [true, "Car must have a brand"]
    },
    model: {
        type: String,
        required: [true, "Car must have a Model"]
    },
    bodyType: {
        type: String,
        required: [true, "Car Must have type"]
    },
    ATMT: {
        type: String,
        enum: {
            values: ["AT", "MT"],
            message: "ATMT values only either AT or MT"
        },
        required: [true, "Car must have a AT or MT type"]
    },
    image: [{
        type: String
    }],
    imageCover: {
        type: String
    },
    description: {
        type: String,
        required: [true, "Car must have a description"]
    },
    price: {
        type: Number,
        required: [true, "Car must have a price"]
    },
    postedAt: {
        type: Date,
        default: Date.now(),
        required: [true, "Car must have posted at"]
    },
    status: {
        type: String,
        enum: {
            values: ["Posted", "Sold"],
            message: "Car must have a status"
        },
        default: "Posted"
    },
    location: locationSchema
})

carsSchema.pre("save", function (next) {
    this.tax.pokokTaxTotal = parseInt(this.tax.PKBPokok + this.tax.SWDKLLJPokok);
    this.tax.dendaTaxTotal = parseInt(this.tax.PKBDenda + this.tax.SWDKLLJDenda);
    next();
})

const cars = mongoose.model("cars", carsSchema);

module.exports = cars;