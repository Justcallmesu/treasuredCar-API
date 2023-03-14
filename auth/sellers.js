// Core Modules
const path = require("path");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));
const APIResponse = require(path.join(__dirname, "../class/APiResponse.js"));


// Methods
const sendToken = require(path.join(__dirname, "../methods/sendToken.js"));


// Models
const sellers = require(path.join(__dirname, "../resources/sellers.js"));