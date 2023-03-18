// Core Modules
const path = require("path");

// Models
const users = require(path.join(__dirname, "../resources/users.js"));

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APIResponse.js"));

// Methods
const validateBody = require(path.join(__dirname, "../methods/validateBody.js"));

exports.updateMyUser = async (req, res, next) => {
    const { body, user } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please attach a data"));

    const { name, email } = body;

    const { name: userName, email: userEmail } = await users.findOneAndUpdate({ _id: user._id }, { name, email }, { new: true }).lean();

    res.status(200).json(new APIResponse(201, "success", "Updated Successfully", { user: { userName, userEmail } }));
};

exports.deleteMyUser = async (req, res, next) => {
    const { user } = req;

    await users.findOneAndDelete({ _id: user._id });

    res.status(204).end();
}