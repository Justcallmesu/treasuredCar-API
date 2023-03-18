const path = require("path");

// Models
const transactions = require(path.join(__dirname, "../resources/transactions.js"));
const cars = require(path.join(__dirname, "../resources/cars.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

exports.createTransactions = async (req, res, next) => {
    const { body, params: { _id }, user } = req;

    Object.keys(body).forEach((value) => {
        if (!body[value]) delete body[value];
    })

    const foundCar = await cars.findOne({ _id });

    if (!foundCar) return next(new APIError(404, "Car not found"));

    const { type, status, createdAt } = await transactions.create({ ...body, carId: _id, userId: user._id });

    res.status(200).json(new APIResponse(200, "success", "Created Successfully", { type, status, createdAt }));
}