const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isUrgent: { type: Boolean, default: false },
  minRate: { type: Number, required: true },
  maxRate: { type: Number, required: true },
  actualRate: { type: Number, default: null },
  acceptanceDate: { type: Date, default: null },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ["open", "in progress", "completed", "pending", "suspend"],
    default: "open",
  },
  createdDate: { type: Date, default: Date.now },
  payment: {
    totalAmount: Number,
    status: { type: String, enum: ['pending', 'paid', 'cancelled'] },
  },
  files: [{ url: { type: String }, fileType: { type: String } }],
  inspiration: [{ url: { type: String }, fileType: { type: String } }],
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal" }],
  proofs: [{ url: { type: String }, fileType: { type: String } }],
  finalProjects: [{ fileUrl: { type: String }, fileName: { type: String } }],
  isPaymentVerified: { type: Boolean, default: false },
  isPaymentTransfer: { type: Boolean, default: false },
  receivedAmount: { type: Number, default: null },
  netAmountTransferToCreative: { type: Number, default: null },

});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
