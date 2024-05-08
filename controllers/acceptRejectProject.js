const Project = require('../models/Project.js');
const CustomError = require('../errors/customError.js');
const Conversation = require('../models/Conversations.js');
const User = require('../models/User.js');
const acceptProject = async (req, res, next) => {
    const { projectId } = req?.params;
    const { actualRate } = req?.query;
    if (!projectId)
        return next(new CustomError("Please Request For Valid Project", 401));

    const project = await Project.findOne({ _id: projectId })

    if (project?.creativeId.toHexString() != req?.userId)
        return next(new CustomError("Please Request For Valid Project", 401));

    if (project?.status == 'open')
        return next(new CustomError("Project Not Assign anyone yet", 401));

    if (project?.status == 'in progress')
        return next(new CustomError("Project already assigned", 401));

    await Conversation.create({
        conversation:
        {
            creative: project?.creativeId,
            athlete: project?.creatorId,
        },

    });

    await User.findOneAndUpdate({ _id: project?.creativeId }, { $push: { projects: projectId } })

    const response = await Project.findOneAndUpdate({ _id: projectId }, { status: "in progress", actualRate });

    if (response)
        return res.success(200, "Project accepted successfully.", response)
    else
        return next(new CustomError("Some thing went wrong in accepting Project", 401));
}





const rejectProject = async (req, res, next) => {
    const { projectId } = req?.params;

    if (!projectId)
        return next(new CustomError("Please Request For Valid Project", 401));

    const project = await Project.findOne({ _id: projectId })

    if (project?.creativeId.toHexString() != req?.userId)
        return next(new CustomError("Please Request For Valid Project", 401));

    if (project?.status == 'open')
        return next(new CustomError("Project is Already Open", 401));

    if (project?.status == 'in progress')
        return next(new CustomError("This Project is in Progress you can't Reject", 401));

    const response = await Project.findOneAndUpdate({ _id: projectId }, { status: "open", creativeId: null });

    if (response)
        return res.success(200, "Project Accept Successfully", response)
    else
        return next(new CustomError("Some Thing Went Wrong in Rejecting Project", 401));

}

module.exports = { acceptProject, rejectProject }