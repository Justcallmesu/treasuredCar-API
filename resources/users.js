// NPM modules
const bcrypt = require("bcrypt");


// Mongoose
const mongoose = require("mongoose");

// Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a name"]
    },
    email: {
        type: String,
        required: [true, "User must have an email"],
        unique: [true, "Email only belong to one user"]
    },
    password: {
        type: String,
        required: [true, "User must have a password"]
    },
    token: {
        type: String,
        required: [true, "Token must attached to User"]
    },
    refreshToken: {
        type: String,
        required: [true, "Refresh Token must attached to User"]
    },
    roles: {
        type: String,
        default: "User",
        enum: {
            values: ["User", "Admin"],
            message: "User must have a role"
        },
        required: [true, "User must have a roles"]
    },
    passwordLastChanged: {
        type: String,
        default: Date.now(),
        required: [true, "User must have Password Last Changed"]
    }
});

// Indexing
userSchema.index({ email: 1 });

// Middleware
userSchema.pre("save", async (next) => {
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});


const users = mongoose.model('users', userSchema);

module.exports = users;