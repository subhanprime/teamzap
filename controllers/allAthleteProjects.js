const Project = require("../models/Project");
const ROLES = require("../config/roles.js");
const allProjectsOfAthlete = async (req, res, next) => {
  const pageNumber = req.query.page || 1;
  const projectsPerPage = 10;
  const { search } = req.query;
  let searchString = search ? search : "";
  const startIndex = (pageNumber - 1) * projectsPerPage;

  const AllAthleteProjectsCount = await Project.countDocuments({
    creatorId: req?.userId,
    $or: [
      { title: { $regex: searchString, $options: "i" } },
      { description: { $regex: searchString, $options: "i" } },
    ],
  });

  const totalPages = Math.ceil(AllAthleteProjectsCount / projectsPerPage);

  const allProjectsOfAthlete = await Project.find({
    creatorId: req?.userId,
    $or: [
      { title: { $regex: searchString, $options: "i" } },
      { description: { $regex: searchString, $options: "i" } },
    ],
  })
    .populate("creatorId")
    .populate("creativeId")
    .populate("proposals")
    .skip(startIndex)
    .limit(projectsPerPage)
    .sort({ createdDate: -1 })
  // const allProjectsOfAthlete = await Project.aggregate([
  //   {
  //     $match: {
  //       $and: [{ creatorId: req?.userId }],
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users", 
  //       localField: "creatorId",
  //       foreignField: "_id",
  //       as: "creatorInfo",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users", 
  //       localField: "creativeId",
  //       foreignField: "_id",
  //       as: "creativeInfo",
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "proposals",
  //       localField: "_id",
  //       foreignField: "projectId",
  //       as: "proposals",
  //     },
  //   },
  //   {
  //     $skip: startIndex,
  //   },
  //   {
  //     $limit: projectsPerPage,
  //   },
  // ]);

  if (allProjectsOfAthlete)
    res.success(201, "All Projects of Athlete", {
      totalPages,
      allProjectsOfAthlete,
    });
  else
    return next(new CustomError("some thing went wrong to get projects", 401));
};

module.exports = { allProjectsOfAthlete };
