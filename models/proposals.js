const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    creativeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    proposedRate: { type: Number, default: null },
    status: { type: String, enum: ['open', "accepted", "rejected"], default: "open" }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
