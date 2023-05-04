// Core Modules
const fspromise = require("fs/promises");
const fs = require("fs");
const path = require("path");

async function deleteOldImage(req, target) {
    if (!req.photo || req.user.photo === "default.jpeg") return;
    let isExist = true;

    const fileName = target === "user" ? req.user.photo : req.seller.photo;
    try {
        await fspromise.access(path.join(__dirname, `../../public/${target}/${fileName}`));
    } catch (error) {
        isExist = false;
    }

    if (isExist) fspromise.rm(path.join(__dirname, `../../public/${target}/${fileName}`));
}

module.exports = deleteOldImage;