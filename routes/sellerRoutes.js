// Core Modules
const path = require('path');

// Auth
const { registerSeller, loginSeller } = require(path.join(__dirname, "../auth/sellers.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));
const { isObjectId } = require('../auth/auth');

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { updateMySeller, deleteMySeller, getSeller, getMySeller } = require(path.join(__dirname, "../representations/sellers.js"));

// Image Process
const processImage = require(path.join(__dirname, "../methods/single-process/processImage.js"));

// Multer 
const { upload } = require(path.join(__dirname, "../app.js"));

// Router
const router = require("express").Router();
const transactionsRoute = require(path.join(__dirname, "./transactionRoutes.js"));
const bookingRoutes = require(path.join(__dirname, "./bookingRoutes.js"));

// Auth
router.route("/register").post(asyncHandler(isLoggedIn), asyncHandler(registerSeller));
router.route("/login").post(asyncHandler(isLoggedIn), asyncHandler(loginSeller));

// Get Seller Data
router.route("/me").get(asyncHandler(isSeller), asyncHandler(getMySeller));
router.use(asyncHandler(isLoggedIn), asyncHandler(isSeller));
router.use("/myTransactions", transactionsRoute); //! Transactions Router
router.use("/myBookings", bookingRoutes); //! Transactions Router

// Manipulate Seller Data
router.route("/updateMe").patch(upload.single("photo"), asyncHandler(processImage("sellers")), asyncHandler(updateMySeller));
router.route("/deleteme").delete(asyncHandler(deleteMySeller));

// Get Seller Data
router.route("/:_id").get(isObjectId, asyncHandler(getSeller));

module.exports = router;