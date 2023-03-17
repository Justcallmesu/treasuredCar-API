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
    const { body } = req;

    if (!Object.keys(body).length) return next(new APIError(400, "Please attach a data"));

    if (!validateBody(body, 3, next)) return;

    const { name, email } = body;

    req.user = { ...req.user, name, email }
    console.log(req.user);

    res.status(200).json({ message: "ok" });
};
