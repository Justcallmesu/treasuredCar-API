// Mongoose
const mongoose = require("mongoose");

// Schema
const sellerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, "Sellers must have a userId"]
    },
    name: {
        type: String,
        required: [true, "Seller must have a name"]
    },
    email: {
        type: String,
        requird: [true, "Seller must have a email"]
    },
    password: {
        type: String,
        required: [true, "Seller must have a password"]
    },
    ratings: {
        type: Number,
        default: 4,
        required: [true, "Sellers must have a ratings"]
    }
});

sellerSchema.index({ email: 1 })

// Middleware
sellerSchema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// Models
const sellers = mongoose.model("sellers", sellerSchema);

modules.exports = sellers;