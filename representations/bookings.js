// Core Modules
const path = require("path");

// Models
const bookings = require(path.join(__dirname, "../resources/bookings.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

exports.getBookings = async (req, res, next) => {
    const { user, seller, baseUrl } = req;

    let query = null;

    if (new RegExp(/(user\/myBookings)/g).test(baseUrl)) {
        query = { userId: user._id }
    } else if (seller) {
        const data = await bookings.aggregate([
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

    const data = await bookings.find(query);

    res.status(200).json(new APIResponse(200, "success", "Data Successfully Fetched", data));
}

exports.updateBookings = async (req, res, next) => {
    const { body, user } = req;

    const isExist = await bookings.findOne({ userId: user._id, transactionId: body.transactionId });

    if (!isExist) return next(new APIError(404, "Bookings Not found"));
    if (isExist.status === "Delivered") return next(new APIError(409, "Bookings already delivered"));
    isExist.status = "Delivered";

    const { status, date, total } = await isExist.save();

    res.status(200).json(new APIResponse(200, "success", "Status Updated Successfully", { booking: { status, date, total } }));
}