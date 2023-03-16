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

    const { mongoQuery } = new QueryConstructor(cars, query).filterOrGet();

    const foundCars = await mongoQuery;

    res.status(200).json(new APIResponse(200, "success", "Data Successfully Fetched", foundCars));
}