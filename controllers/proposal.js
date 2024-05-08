const CustomError = require('../errors/customError.js');
const Proposal = require("../models/proposals.js");
const Project = require('../models/Project.js');
const { VALUES } = require('../config/values.js');



const submitProposal = async (req, res, next) => {


    const { projectId, creativeId, proposedRate } = req.body;

    if (!projectId || !creativeId)
        return next(new CustomError("Please Provide All Fields", 401));
    let findExistingProposal = await Proposal.findOne({ projectId, creativeId });

    if (findExistingProposal != null)
        // return next(new CustomError("You Already submit Proposal for this Project", 401));
        return next(new CustomError("You've already submitted a proposal for this project.", 401));

    let checkStatus = await Project.findOne({ _id: projectId }, { _id: 0, status: 1 });

    if (checkStatus?.status !== 'open' && checkStatus?.status !== 'pending')
        return next(new CustomError("You Can't send Proposal for this Project", 401));

    let updatedRate = proposedRate ? proposedRate : null;

    let response = await Proposal.create({ projectId, creativeId, proposedRate: updatedRate });

    await Project.findOneAndUpdate({ _id: projectId }, { "$push": { proposals: response?._id } });

    if (response)
        return res.success(201, "Proposal Created Successfully", response);
    else
        return next(new CustomError("Some Thing Went Wrong", 401));
}




const acceptProposalOfCreative = async (req, res, next) => {

    const { proposalId } = req.params;

    if (!proposalId) {
        return next(new CustomError('There is No Proposal Find', 401));
    }


    const foundProposal = await Proposal.findOne({ _id: proposalId });


    if (!foundProposal) {
        return next(new CustomError('There is No Proposal Find', 401));
    }

    if (foundProposal.status === 'accepted') {
        return next(new CustomError('This Proposal is already accepted', 401));
    }

    if (foundProposal.status === 'rejected') {
        return next(new CustomError('This Proposal is already rejected', 401));
    }


    const proposedRate = foundProposal.proposedRate ? parseInt(foundProposal.proposedRate, 10) : 0;
    // console.log("proposedRate", proposedRate)

    const foundProject = await Project.findOneAndUpdate({ _id: foundProposal.projectId }, { $set: { creativeId: foundProposal.creativeId, actualRate: foundProposal.proposedRate, acceptanceDate: new Date() } }, { new: true });



    if (!foundProject) {
        return next(new CustomError('There is no project Available', 401));
    }


    await Proposal.findOneAndUpdate({ _id: proposalId }, { $set: { status: VALUES.ACCEPTED } })

    return res.success(201, 'Accept proposal of creative');


}


const rejectProposalOfCreative = async (req, res, next) => {
    const { proposalId } = req.params;
    if (!proposalId) {
        return next(new CustomError('There is No Proposal Find', 401));
    }
    await Proposal.findOneAndUpdate({ _id: proposalId }, { $set: { status: VALUES.REJECTED } });
    res.success(201, 'proposal Rejected Successfully')
}

module.exports = { submitProposal, acceptProposalOfCreative, rejectProposalOfCreative };
