// Core Mdouels
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));
const QueryConstructor = require(path.join(__dirname, "../class/QueryConstructor.js"));

// Models
const cars = require(path.join(__dirname, "../resources/cars.js"));

// Methods
const validateBody = require(path.join(__dirname, "../methods/validateBody.js"));

exports.postCar = async function (req, res, next) {
    const { body, seller } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Must contain data"));

    if (validateBody(body, 11, next)) return;

    const { _doc } = await cars.create({ sellerId: seller._id, ...body });

    return res.status(201).json(new APIResponse(200, "success", "Car Successfully Created", _doc));
};

exports.getCars = async function (req, res, next) {
    const { query } = req;

    const { mongoQuery } = new QueryConstructor(cars, query).filterOrGet().pagination();

    const foundCars = await mongoQuery;

    res.status(200).json(new APIResponse(200, "success", "Data Successfully Fetched", foundCars));
}

exports.getCar = async function (req, res, next) {
    const { params: { _id } } = req;

    const foundData = await cars.findOne({ _id }).lean();

    if (!foundData) return res.status(404).json(new APIError(404, "Not Found"));

    res.status(200).json(new APIResponse(200, "success", "Successfully Fetched", foundData));
}

exports.updateCar = async function (req, res, next) {
    const { body, params: { _id } } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Must contain data"));

    const foundCar = await cars.findOne({ _id }).select("-_id -sellerId");

    if (!foundCar) return res.status(404).json(new APIError(404, "Not Found"));

    const status = await cars.findOneAndUpdate({ _id }, { ...foundCar.toObject(), ...body }, { new: true }).select("-_id -sellerId");

    res.status(200).json(new APIResponse(200, "success", "Updated", status.toObject()));
};

exports.deleteCar = async function (req, res, next) {
    const { params: { _id } } = req;

    const foundCar = await cars.findOne({ _id });

    if (!foundCar) return res.status(404).json(new APIError(404, "Not Found"));

    await cars.deleteOne({ _id });

    res.status(204).end();
}