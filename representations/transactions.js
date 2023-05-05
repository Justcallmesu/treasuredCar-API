const path = require("path");

// Models
const transactions = require(path.join(__dirname, "../resources/transactions.js"));
const bookings = require(path.join(__dirname, "../resources/bookings.js"));
const users = require(path.join(__dirname, "../resources/users.js"));
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

exports.getTransactions = async (req, res, next) => {
    const { user, seller, baseUrl } = req;

    let query = null;

    if (new RegExp(/(user\/myTransactions)/g).test(baseUrl)) {
        query = { userId: user._id }
    } else if (seller) {
        const data = await transactions.aggregate([
            {
                "$lookup": {
                    from: "cars",
                    localField: "carId",
                    foreignField: "_id",
                    as: "car"
                }
            },
            {
                $unwind: {
                    path: "$car"
                }
            },
            {
                $project: {
                    carId: 0
                }
            },
            {
                "$match": {
                    "car.sellerId": seller._id
                }
            }
        ]);
        return res.status(200).json(new APIResponse(200, "success", "Data Successfully Fetched", data));
    }

    if (!query) return next(new APIError(401, "You are not user or seller please login"));

    const data = await transactions.find(query);

    res.status(200).json(new APIResponse(200, "success", "Data Successfully Fetched", data));
}

exports.updateTransactionsStatus = async (req, res, next) => {
    const { user, body } = req;

    if (!user) return next(new APIError(404, "User Not Found"));

    const transaction = await transactions.findOne({ userId: user._id, carId: body.carId });

    if (transaction.status === "paid") return next(new APIError(409, "Transactions already paid"));

    if (!transaction) return next(new APIError(404, "Transaction Not Found"));

    const foundCars = await cars.findOne({ _id: body.carId });

    if (!foundCars) return next(new APIError(404, "No Car Found"));

    const booking = await bookings.create({ userId: user._id, carId: body.carId, transactionId: transaction._id, total: foundCars.price });

    transaction.status = "paid";

    await transaction.save();


    res.status(200).json(new APIResponse(200, "success", "Status Updated Successfully", { Transaction: transaction, booking }));
}