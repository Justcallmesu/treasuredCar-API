// Core Modules
const path = require("path");

// NPM Modules
const sharp = require("sharp");

// Class
const APIError = require(path.join(__dirname, "../../class/APIerror.js"));

async function compressImage(req, target, next) {
    if (!req.file) return;

    if (target === "cars" && !req.body?.name) return next(new APIError(400, "Cars must have a name"));

    if (req.file.mimetype.split("/")[0] !== "image") {
        return next(new APIError(400, "File is not an image"))
    }

    let uniqueId = "";

    if (target === "users") uniqueId = req.user._id;
    if (target === "sellers") uniqueId = req.seller._id;
    if (target === "cars") uniqueId = req.body.name;

    const fileName = req.photo = `${target}-${uniqueId}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize({ height: 300, width: 300, fit: "outside" })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(path.join(__dirname, `../public/${target}/${fileName}`));
    return;
}

module.exports = compressImage;