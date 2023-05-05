// Core Modules
const path = require("path");

// NPM Modulex
const express = require("express");

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Auth Methods
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));

// Instance
const router = express.Router();

// Handler
const { findOtp } = require(path.join(__dirname, "../representations/otp.js"));


// Routing
router.post("/", asyncHandler(findOtp));

module.exports = router;