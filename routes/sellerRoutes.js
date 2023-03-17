// Core Modules
const path = require('path');

// Auth
const { registerSeller, loginSeller } = require(path.join(__dirname, "../auth/sellers.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { updateMySeller } = require(path.join(__dirname, "../representations/sellers.js"));

// Router
const router = require("express").Router();

router.route("/register").post(asyncHandler(isLoggedIn), asyncHandler(registerSeller));
router.route("/login").post(asyncHandler(isLoggedIn), asyncHandler(loginSeller));

router.use(asyncHandler(isLoggedIn), asyncHandler(isSeller));

router.route("/me").patch(asyncHandler(updateMySeller));

module.exports = router;