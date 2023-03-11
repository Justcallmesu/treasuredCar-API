// Mongoose
const mongoose = require("mongoose");

// Schema
const chatSchema = mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        required: [true, "Chat must have sender userId"],
        ref: "users"
    },
    to: {
        type: mongoose.Types.ObjectId,
        required: [true, "Chat must have target userID"],
        ref: "users"
    },
    content: {
        type: String,
        required: [true, "Chat must have a content"],
        validate: {
            validator: function (v) {
                return v !== "";
            },
            message: "Chat must not empty"
        }
    },
    type: {
        type: String,
        enum: {
            values: ["images", "string"],
            message: "Values must only either images or string"
        },
        required: [true, "chat must have a type"]
    }
});


chatSchema.pre(/^find/, (doc, next) => {
    doc.populate("to");
    next();
});

const chats = mongoose.model("chats", chatSchema);

module.exports = chats;