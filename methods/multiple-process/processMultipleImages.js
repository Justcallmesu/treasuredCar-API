// Core Modules
const path = require("path");

// Functions


function processMultipleImage() {
    return async (req, res, next) => {
        console.log(req.file);
        next();
    }
}

module.exports = processImage;