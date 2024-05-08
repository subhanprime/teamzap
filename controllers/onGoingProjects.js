const Project = require("../models/Project");

const onGoingProject = async (req, res, next) => {
  const pageNumber = req.query.page || 1;
  const projectsPerPage = 10;

  const startIndex = (pageNumber - 1) * projectsPerPage;

  const ongoingProjectsCount = await Project.countDocuments({
    $and: [{ creatorId: req?.userId }, { status: "in progress" }],
  });

  const totalPages = Math.ceil(ongoingProjectsCount / projectsPerPage);

  const ongoingProjects = await Project.find({
    $and: [{ creatorId: req?.userId }, { status: "in progress" }],
  }).populate('creatorId')
    .skip(startIndex)
    .limit(projectsPerPage);

  if (ongoingProjects)
    res.success(201, "Ongoing projects", { totalPages, ongoingProjects });
  else
    return next(new CustomError("some thing went wrong to get projects", 401));
};

module.exports = { onGoingProject };
