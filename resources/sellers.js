// Core Modules
const path = require("path");

// NPM modules
const bcrypt = require("bcrypt");

// Class
const APIError = require(path.join(__dirname, "../class/APIerror.js"));

// Mongoose
const mongoose = require("mongoose");

// Schema
const sellerSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: [true, "Sellers must have a userId"],
            unique: true,
            select: false
        },
        name: {
            type: String,
            required: [true, "Seller must have a name"]
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Seller must have a email"]
        },
        phoneNumber: {
            type: String,
            required: [true, "Seller must have a phone number"]
        },
        address: {
            type: String,
            required: [true, "Seller Must have a address"]
        },
        password: {
            type: String,
            required: [true, "Seller must have a password"],
            select: false
        },
        photo: {
            type: String,
            default: "defaultStore.jpg"
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now()
        },
        infoChangeCooldown: {
            type: Date,
            default: Date.now()
        }
    },
    {
        methods: {
            async comparePassword(candidate) {
                return await bcrypt.compare(candidate, this.get("password"));
            },
            compareInfoChangeDate() {
                const date = new Date(this.infoChangeCooldown);
                date.setDate(this.infoChangeCooldown.getDate() + 30);

                return Date.now() > date;
            }
        }
    }
);

sellerSchema.index({ email: 1 });
sellerSchema.index({ userId: 1 });
sellerSchema.index({ userId: 1, email: 1 });

// Middleware
sellerSchema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

sellerSchema.pre("findOneAndUpdate", async function (next) {
    const doc = await this.model.findOne(this.getQuery());

    this._update.infoChangeCooldown = Date.now();
    next();
})

// Models
const sellers = mongoose.model("sellers", sellerSchema);

module.exports = sellers;