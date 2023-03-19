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