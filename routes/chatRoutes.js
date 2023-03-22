// Core Modules
const path = require("path");

// NPM Modules
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// Router
const router = require("express").Router();

// Web Socket
function sendPrivate(io, socket) {
    socket.on("private", (data) => {
        console.log(data);
    })
}


module.exports = { router, sendPrivate };