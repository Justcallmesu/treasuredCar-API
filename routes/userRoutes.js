// Core Modules
const path = require("path");

// Authorization Methods
const { login, register } = require(path.join(__dirname, "../auth/users.js"));

// Router
const router = require("express").Router();

router.route("/login").post(login);
router.route("/register").post(register);

module.exports = router;