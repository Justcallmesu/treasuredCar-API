// Core Modules
const path = require("path");

// Router
const router = require("express").Router();
const tranasctionsRoute = require(path.join(__dirname, "./transactionRoutes.js"))

// Authorization Methods
const { isSeller } = require(path.join(__dirname, "../auth/SellersAuth.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));
const { isObjectId } = require(path.join(__dirname, "../auth/auth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { postCar, getCars, getCar, updateCar, deleteCar } = require(path.join(__dirname, "../representations/cars.js"));

// Image Process
const processMultipleImages = require(path.join(__dirname, "../methods/multiple-process/processMultipleImages.js"));

// Multer 
const { upload } = require(path.join(__dirname, "../app.js"));

// Transactions Route
router.use("/:_id/transactions", tranasctionsRoute);

// Cars Route
router.route("/")
    .get(getCars)

router.route("/:_id").get(isObjectId, getCar);

router.use(asyncHandler(isLoggedIn), asyncHandler(isSeller));

router.route("/").post(upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "image", maxCount: 4 }
]), processMultipleImages("cars"), asyncHandler(postCar));

router.use(isObjectId);

router.route("/:_id")
    .patch(asyncHandler(updateCar))
    .delete(asyncHandler(deleteCar));

module.exports = router;