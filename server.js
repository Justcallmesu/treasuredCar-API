// Core modules
const path = require("path");

// NPM Modules
const dotenv = require("dotenv");

// Env 
dotenv.config({ path: path.join(__dirname, ".env") });

// App Instances
const { server } = require(path.join(__dirname, "./app.js"));



// Server Listening
server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});