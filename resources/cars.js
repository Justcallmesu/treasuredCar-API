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
        default: 0
    },
    pokokTaxTotal: {
        type: String,
        required: [true, "Car Must have Tax pokok Total"]
    }
})

const locationSchema = mongoose.Schema({
    type: {
        type: String,
        enum: {
            values: ["Point"],
            message: "type can only be in the form of Points"
        },
        required: [true, "type must be filled"]
    },
    coordinates: [{
        type: Number,
        required: [true, "Location must have a coordinates"]
    }]
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
    horsePower: {
        type: String
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
    image: [{
        type: String
    }],
    imageCover: {
        type: String
    },
    location: locationSchema
})


const cars = mongoose.model("cars", carsSchema);

module.exports = cars;