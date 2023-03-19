// Core Modules
const path = require("path");

// Authorization Methods
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isObjectId } = require(path.join(__dirname, "../auth/auth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { getBookings, updateBookings } = require(path.join(__dirname, "../representations/bookings.js"));

// Router
const router = require("express").Router();

router.use(isLoggedIn);
router.route("/")
    .get(asyncHandler(getBookings))
    .patch(asyncHandler(updateBookings));

module.exports = router;