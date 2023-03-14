// Core Modules
const path = require('path');

// Auth
const { registerSeller, isUserRegistered } = require(path.join(__dirname, "../auth/sellers.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));

// Router
const router = require("express").Router();

router.route("/register").post(isLoggedIn, registerSeller)


module.exports = router;