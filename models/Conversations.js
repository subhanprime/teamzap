const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    conversation: [
        {
            creative: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            athlete: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
        }
    ]
})


const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
