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
        },
        ratings: {
            type: Number,
            default: 4,
            required: [true, "Sellers must have a ratings"]
        }
    },
    {
        methods: {
            async comparePassword(candidate) {
                return await bcrypt.compare(candidate, this.get("password"));
            },
            compareInfoChangeDate() {
                return this.infoChangeCooldown < new Date(new Date().setDate(this.infoChangeCooldown.getDate() + 31));
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

    if (doc.compareInfoChangeDate()) {
        const cooldownReset = new Date(new Date().setDate(doc.infoChangeCooldown.getDate() + 31))
            .toLocaleDateString("EN-en", {
                dateStyle: "full"
            });
        return next(new APIError(400, `You can only change info after 1 month prior last update, Cooldown Reset at ${cooldownReset}`));
    }

    this._update.infoChangeCooldown = Date.now();
    next();
})

// Models
const sellers = mongoose.model("sellers", sellerSchema);

module.exports = sellers;