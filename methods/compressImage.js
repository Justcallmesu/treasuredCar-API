// Core Modules
const path = require("path");

// NPM Modules
const sharp = require("sharp");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

async function compressImage(req, target, next) {
    if (!req.file) return;

    if (req.file.mimetype.split("/")[0] !== "image") {
        return next(new APIError(400, "File is not an image"))
    }

    const fileName = req.photo = `${target}-${target === "users" ? req.user._id : req.sellers._id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize({ height: 300, width: 300, fit: "outside" })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(path.join(__dirname, `../public/${target}/${fileName}`));
    return;
}

module.exports = compressImage;