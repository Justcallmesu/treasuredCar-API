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

    const { name: sellerName, email: sellerEmail } = await sellers.findOneAndUpdate({ _id: seller._id }, { name, email, phoneNumber }, { new: true }).lean();

    res.status(200).json(new APIResponse(201, "success", "Updated Successfully", { user: { sellerName, sellerEmail } }));
};

exports.deleteMySeller = async (req, res, next) => {
    const { seller } = req;

    await sellers.findOneAndDelete({ _id: seller._id });

    res.status(204).end();
}