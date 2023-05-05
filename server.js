// Core modules
const path = require("path");

// NPM Modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Env 
dotenv.config({ path: path.join(__dirname, ".env") });

// App Instances
const { app } = require(path.join(__dirname, "./app.js"));

// Mongoose Connection
(async function () {
    try {
        await mongoose.connect(process.env.NODE_ENV === "production" ? process.env.ATLASCONNECT : "mongodb://localhost:27017/treasuredcar");
        console.log("Database Connected");
    } catch (error) {
        console.log("Database Failed to Connect")
    }
})();


// Server Listening
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});