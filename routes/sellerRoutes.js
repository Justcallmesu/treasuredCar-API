// Core Modules
const path = require('path');

// Auth
const { registerSeller, loginSeller } = require(path.join(__dirname, "../auth/sellers.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { updateMySeller, deleteMySeller } = require(path.join(__dirname, "../representations/sellers.js"));

// Router
const router = require("express").Router();
const transactionsRoute = require(path.join(__dirname, "./transactionRoutes.js"));
const bookingRoutes = require(path.join(__dirname, "./bookingRoutes.js"));

router.route("/register").post(asyncHandler(isLoggedIn), asyncHandler(registerSeller));
router.route("/login").post(asyncHandler(isLoggedIn), asyncHandler(loginSeller));

router.use(asyncHandler(isLoggedIn), asyncHandler(isSeller));
router.use("/myTransactions", transactionsRoute); //! Transactions Router
router.use("/myBookings", bookingRoutes); //! Transactions Router

router.route("/me").patch(asyncHandler(updateMySeller));
router.route("/deleteme").delete(asyncHandler(deleteMySeller));

module.exports = router;