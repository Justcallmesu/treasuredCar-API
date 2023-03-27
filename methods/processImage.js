// Core Modules
const path = require("path");

// Functions
const compressImage = require(path.join(__dirname, "./compressImage.js"));
const deleteOldImage = require(path.join(__dirname, "./deleteOldImage.js"));

function processImage(target) {
    return async (req, res, next) => {
        await compressImage(req, target, next);
        await deleteOldImage(req, target);
        next();
    }
}

module.exports = processImage;