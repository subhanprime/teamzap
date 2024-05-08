const CustomError = require('../errors/customError.js');
const Proposal = require("../models/proposals.js");
const Project = require("../models/Project.js");
const mongoose = require('mongoose');
const Conversation = require('../models/Conversations.js');
const User = require('../models/User.js');

const athleteAcceptProposalOfCreative = async (req, res, next) => {
    const { proposalId } = req.body;
    if (!proposalId)
        return next(new CustomError("Provide all Required Fields", 401));

    const findProposal = await Proposal.findOne({ _id: proposalId });

    if (!findProposal)
        return next(new CustomError("There is no Record found", 401));

    const acceptProject = await Project.findOneAndUpdate({ _id: findProposal?.projectId }, { creativeId: findProposal.creativeId }, { new: true });

    if (acceptProject.creatorId !== new mongoose.Types.ObjectId(req.userId))
        return next(new CustomError("You are not eligible for accept this proposal", 401));

    if (acceptProject?.creativeId)
        return next(new CustomError("someone already working on this project", 401));

    await Conversation.create({
        conversation:
        {
            creative: findProposal?.creativeId,
            athlete: req?.userId,
        },

    });

    await User.findOneAndUpdate({ _id: findProposal?.creativeId }, { $push: { projects: findProposal?.projectId } });

    if (!acceptProject)
        return next(new CustomError("Some thing went wrong in accepting this Proposal", 401));
    else
        return res.success(201, "Proposal Accept Successfully");
};



module.exports = { athleteAcceptProposalOfCreative }