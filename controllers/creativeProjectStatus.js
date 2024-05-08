const Project = require("../models/Project.js");
const User = require("../models/User.js");
const CustomError = require("../errors/customError.js");

const pendingProjects = async (req, res, next) => {
  if (req?.role != "creative")
    return next(new CustomError("You Are Not Creative User", 401));

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const perPage = 10;

  const totalPendingProjects = await Project.countDocuments({
    creativeId: req?.userId,
    status: "pending",
  });

  const totalPages = Math.ceil(totalPendingProjects / perPage);

  const projects = await Project.find({
    creativeId: req?.userId,
    status: "pending",
  })
    .populate("creatorId")
    .skip((page - 1) * perPage)
    .limit(perPage);

  if (projects) {
    res.success(200, "Pending projects of creative", { projects, totalPages });
  } else {
    return next(new CustomError("Some Thing Went Wrong", 401));
  }
};

const inProgressProjects = async (req, res, next) => {
  if (req?.role != "creative")
    return next(new CustomError("You Are Not Creative User", 401));

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const perPage = 10;

  const totalPendingProjects = await Project.countDocuments({
    creativeId: req?.userId,
    status: "in progress",
  });

  const totalPages = Math.ceil(totalPendingProjects / perPage);

  const projects = await Project.find({
    creativeId: req?.userId,
    status: "in progress",
  })
    .populate("creatorId")
    .skip((page - 1) * perPage)
    .limit(perPage);

  if (projects) {
    res.success(200, "inProgress projects of creative", {
      projects,
      totalPages,
    });
  } else {
    return next(new CustomError("Some Thing Went Wrong", 401));
  }
};

module.exports = { inProgressProjects, pendingProjects };
