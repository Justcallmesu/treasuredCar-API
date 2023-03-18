// Core Modules
const path = require('path');

// Auth
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { createTransactions } = require(path.join(__dirname, "../representations/transactions.js"));

// Router
const router = require("express").Router({ mergeParams: true });

router.use(asyncHandler(isLoggedIn));

router.route("/").post(asyncHandler(createTransactions));

module.exports = router;