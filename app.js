// Core Modules
const path = require("path");

// App Initialization
const express = require("express");
const app = express();

// NPM Modules
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const EPPP = require("express-parameter-polution-preventer");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss_clean = require("xss-clean");
const multer = require("multer");

// Development Tools
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Public Resources
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss_clean());
app.use(EPPP({
    join: "off"
}));

app.use(cors({ origin: "http://localhost:8080", credentials: true }))

// Error Handler
const errorHandler = require(path.join(__dirname, "./error/errorHandler.js"))

// Parser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));

// Multer Instance
const memoryStorage = multer.memoryStorage();
const upload = multer({ dest: path.join(__dirname, "../public/users/"), storage: memoryStorage });
module.exports = { upload };

// Router
const booking = require(path.join(__dirname, "./routes/bookingRoutes.js"));
const car = require(path.join(__dirname, "./routes/carRoutes.js"));
const seller = require(path.join(__dirname, "./routes/sellerRoutes.js"));
const transaction = require(path.join(__dirname, "./routes/transactionRoutes.js"));
const user = require(path.join(__dirname, "./routes/userRoutes.js"));

// Server Check
app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server Up and Running"
    });
});

// Cors
app.options("*", cors({ origin: "http://localhost:8080" }));


// Routing
app.use("/api/v1/user", user);
app.use("/api/v1/seller", seller);

app.use("/api/v1/transaction", transaction);
app.use("/api/v1/booking", booking);

app.use("/api/v1/car", car);

// Error Handling
app.use("*", errorHandler)

module.exports = { app };