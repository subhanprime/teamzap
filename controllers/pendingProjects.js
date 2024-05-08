const Project = require('../models/Project');

const pendingProjects = async (req, res, next) => {
    const pageNumber = req.query.page || 1;
    const projectsPerPage = 10;

    const startIndex = (pageNumber - 1) * projectsPerPage;

    const ongoingProjectsCount = await Project.countDocuments({
        $and: [
            { creatorId: req?.userId },
            { status: 'pending' }
        ]
    });

    const totalPages = Math.ceil(ongoingProjectsCount / projectsPerPage);

    const pendingProjects = await Project.find({
        $and: [
            { creatorId: req?.userId },
            { status: 'pending' }
        ]
    }).populate('creatorId').skip(startIndex).limit(projectsPerPage);

    if (pendingProjects)
        res.success(201, "pending Projects", {totalPages, pendingProjects})
    else
        return next(new CustomError("some thing went wrong to get projects", 401));
}


module.exports = { pendingProjects }