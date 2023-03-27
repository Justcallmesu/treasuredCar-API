// Core Modules
const path = require("path");

// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));


exports.updateMySeller = async (req, res, next) => {
    const { body, seller } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please attach a data"));

    const { name, email, phoneNumber } = body;

    let query = !req.photo ? { name, email, phoneNumber } : { name, email, phoneNumber, photo: req.photo };

    const { name: sellerName, email: sellerEmail, photo } = await sellers.findOneAndUpdate({ _id: seller._id }, query, { new: true }).lean();

    res.status(200).json(new APIResponse(201, "success", "Updated Successfully", { seller: { sellerName, sellerEmail, photo } }));
};

exports.deleteMySeller = async (req, res, next) => {
    const { seller } = req;

    await sellers.findOneAndDelete({ _id: seller._id });

    res.status(204).end();
}