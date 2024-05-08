const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    text: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{timestamps:true});

const Messages = mongoose.model("Messages", messagesSchema);

module.exports = Messages;
