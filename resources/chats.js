// Mongoose
const mongoose = require("mongoose");

// Schema
const chatSchema = mongoose.Schema({
    users: [{
        type: mongoose.Types.ObjectId,
        ref: "users"
    }],
    chats: [{
        to: {
            type: String,
            required: [true, "chats must have a target"]
        },
        from: {
            type: String,
            required: [true, "chats must have a from"]
        },
        content: {
            type: String,
            required: [true, "chats must have a content"]
        }
    }]
});

chatSchema.pre(/^find/, (doc, next) => {
    doc.populate("users");
    next();
});

const chats = mongoose.model("chats", chatSchema);

module.exports = chats;