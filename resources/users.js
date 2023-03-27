// NPM modules
const bcrypt = require("bcrypt");

// Mongoose
const mongoose = require("mongoose");

// Schema
const userSchema = mongoose.Schema(
    {
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
            required: [true, "User must have a password"],
            select: false
        },
        role: {
            type: String,
            default: "User",
            enum: {
                values: ["User", "Admin"],
                message: "User must have a role"
            },
            required: [true, "User must have a roles"],
            select: false
        },
        photo: {
            type: String,
            default: "default.jpg"
        },
        passwordLastChanged: {
            type: String,
            default: Date.now(),
            required: [true, "User must have Password Last Changed"]
        }
    },
    {
        methods: {
            async comparePassword(candidate) {
                return await bcrypt.compare(candidate, this.get("password"));
            }
        }
    }
);

// Indexing
userSchema.index({ email: 1 });

// Middleware
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 12);
        } catch (error) {
            next(error);
        }
    }
    next();
});


const users = mongoose.model('users', userSchema);

module.exports = users;