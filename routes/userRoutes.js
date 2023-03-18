// Core Modules
const path = require("path");

// Authorization Methods
const { login, register } = require(path.join(__dirname, "../auth/users.js"));
const { isLoggedIn } = require(path.join(__dirname, "../auth/UsersAuth.js"));

// Error Handler
const asyncHandler = require(path.join(__dirname, "../error/AsyncHandler.js"))

// Methods
const { updateMyUser, deleteMyUser } = require(path.join(__dirname, "../representations/users.js"));

// Router
const router = require("express").Router();

router.route("/login").post(asyncHandler(login));
router.route("/register").post(asyncHandler(register));

router.use(asyncHandler(isLoggedIn));

router.route("/me").patch(asyncHandler(updateMyUser));
router.route("/deleteme").delete(asyncHandler(deleteMyUser));


module.exports = router;