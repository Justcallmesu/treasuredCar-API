// Core Modules
const path = require("path");


// Router
const router = require("express").Router();

// Authorization Methods
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));

// Methods
const { postCar } = require(path.join(__dirname, "../representations/cars.js"));

router.route("/").post(isLoggedIn, isSeller, postCar);

module.exports = router;