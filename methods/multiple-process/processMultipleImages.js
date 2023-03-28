// Core Modules
const path = require("path");

// NPM Modules
const sharp = require("sharp");

// Class
const APIError = require(path.join(__dirname, "../../class/APIerror.js"));


function processMultipleImage() {
    return async (req, _, next) => {
        if (!req.body?.name) return next(new APIError(400, "Car must have a name"));
        if (req.files.imageCover) {
            const fileName = req.body.imageCover = `cars-${req.body.name}-cover-${req.seller._id}-${Date.now()}.jpeg`

            await sharp(req.files.imageCover[0].buffer)
                .resize({ height: 300, width: 300, fit: "outside" })
                .toFormat("jpeg")
                .jpeg({ quality: 80 })
                .toFile(path.join(__dirname, `../../public/cars/${fileName}`));
        }

        if (req.files.image) {
            req.body.image = [];
            await Promise.all(req.files.image.map(async (value, index) => {
                const fileName = req.body.imageCover = `cars-${req.body.name}-Image${index + 1}-${req.seller._id}-${Date.now()}.jpeg`
                await sharp(value.buffer)
                    .resize({ height: 300, width: 300, fit: "outside" })
                    .toFormat("jpeg")
                    .jpeg({ quality: 80 })
                    .toFile(path.join(__dirname, `../../public/cars/${fileName}`));
                req.body.image.push(fileName);
            }))
        }
        next();
    }
}

module.exports = processMultipleImage;