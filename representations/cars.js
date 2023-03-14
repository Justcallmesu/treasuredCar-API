// Core Mdouels
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

// Models
const cars = require(path.join(__dirname, "../resources/cars.js"));

exports.postCar = async function (req, res, next) {
    const { body } = req;

    if (body) {
        return next(new APIError(400, "Must contain data")).lean();
    };

    const createdCar = await cars.create(body);

    return res.status(201).json(new APIResponse(200, "success", "Car Successfully Created", createdCar));
}