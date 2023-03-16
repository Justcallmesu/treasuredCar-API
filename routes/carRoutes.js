// Core Modules
const path = require("path");


// Router
const router = require("express").Router();

// Authorization Methods
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));

// Methods
const { postCar, getCars, getCar, updateCar, deleteCar } = require(path.join(__dirname, "../representations/cars.js"));

router.route("/")
    .get(getCars)

router.route("/:_id").get(getCar);

router.use(isLoggedIn, isSeller);

router.route("/").post(postCar);

router.route("/:_id")
    .patch(updateCar)
    .delete(deleteCar);

module.exports = router;