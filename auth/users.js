// NPm Modules
const jwt = require("jsonwebtoken");
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));

// Models
const users = require(path.join(__dirname, "../resources/users.js"));

// Methods
const sendToken = require(path.join(__dirname, "../methods/sendToken.js"));

/***
 * @param @type data   passed data must in a object form
 * @param length how many data you expect to get
 * @param next
 *  ***/
function validateBody(data, amount, next) {
    if (Object.keys(data).length > amount) {
        next(new APIError(400, "There is more data attached to the body"));
        return true;
    }

    if (Object.keys(data).length < amount) {
        next(new APIError(400, "There is missing data in the body"))
        return true;
    };

    return false;
}


exports.login = async function (req, res, next) {
    const { body } = req;
    if (!body) return next(new APIError(400, "Please attach a data"));

    if (validateBody(body, 2, next)) return;

    if (!("email" in body) || !("password" in body)) return next(new APIError(400, "There is unknown data attached to the body"));

    const foundUser = await users.findOne({ email: body.email }).select("+password");

    if (!foundUser) return next(new APIError(400, "Your email or password is incorrect"));
    if (!(await foundUser.comparePassword(body.password))) return next(new APIError(400, "Your email or password is incorrect"));

    sendToken(req, res, body.email, new APIResponse(200, "success", "login Successfully"));
};


exports.register = async function (req, res, next) {
    const { body } = req;
    if (!body) return next(new APIError(400, "Please attach a data"));

    if (validateBody(body, 4, next)) return;

    if (!("email" in body) || !("name" in body) || !("confirmPassword" in body) || !("password" in body)) {
        return next(new APIError(400, "There is unknown data attached to the body"));
    }

    if (body.password !== body.confirmPassword) return next(new APIError(400, "Password And confirm password doesnt match"));

    const isEmailExist = await users.findOne({ email: body.email });

    if (isEmailExist) return next(new APIError(409, "Email already used !"));

    const { name, email } = await users.create(body);

    sendToken(req, res, email, new APIResponse(201, "success", "User created successfully", { user: { name, email } }));

}