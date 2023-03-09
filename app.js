// Core Modules
const path = require("path");

// App Initialization
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// NPM Modules
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss_clean = require("xss-clean");
const EPPP = require("express-parameter-polution-preventer");
const cors = require("cors");

// Development Tools
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Public Resources
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss_clean());
app.use(EPPP({
    join: "off"
}));
app.use(cors({ origin: "*" }))

// Router
const chat = require(path.join(__dirname, "./routes/chat.js"));
const booking = require(path.join(__dirname, "./routes/booking.js"));
const car = require(path.join(__dirname, "./routes/car.js"));
const seller = require(path.join(__dirname, "./routes/seller.js"));
const transaction = require(path.join(__dirname, "./routes/transaction.js"));
const user = require(path.join(__dirname, "./routes/user.js"));

// Routing
app.use("/api/v1/chat", chat);
app.use("/api/v1/booking", booking);
app.use("/api/v1/car", car);
app.use("/api/v1/seller", seller);
app.use("/api/v1/transaction", transaction);
app.use("/api/v1/user", user);

module.exports = { server, io };