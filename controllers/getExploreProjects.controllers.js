const Project = require('../models/Project.js');
const User = require('../models/User.js');

const exploreProjects = async (req, res, next) => {

    const page = req?.query?.page
    const pageNumber = page ?? 1;
    const projectsPerPage = 12;

    const user = await User.aggregate([
        {
            $match: { email: req?.email }
        },
        {
            $lookup: {
                from: "skills",
                localField: "profile.skills",
                foreignField: "_id",
                as: "userSkills"
            }
        },
        {
            $project: {
                _id: 0,
                userSkills: "$userSkills.name"
            }
        }
    ]);

    if (!user)
        return next(new CustomError("Something went wrong", 401));

    const userSkills = user[0]?.userSkills || [];
    const totalCount = await Project.aggregate([
        {
            $addFields: {
                matchCount: {
                    $size: {
                        $setIntersection: ["$skillsRequired", userSkills]
                    }
                }
            }
        },
        {
            $count: "totalCount"
        }
    ]);

    const totalProjects = totalCount[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const projects = await Project.aggregate([
        {
            $match: {
                status: "open"
            }
        },
        {
            $addFields: {
                matchCount: {
                    $size: {
                        $setIntersection: ["$skillsRequired", userSkills]
                    }
                }
            }
        },
        {
            $sort: { matchCount: -1 }
        },
        {
            $skip: (pageNumber - 1) * projectsPerPage
        },
        {
            $limit: projectsPerPage
        },
        {
            $lookup: {
                from: "users",
                localField: "creatorId",
                foreignField: "_id",
                as: "creator"
            }
        },
        {
            $addFields: {
                creator: { $arrayElemAt: ["$creator", 0] }
            }
        },
        {
            $project: {
                "creator.favoriteCreativeOfAthleteList": 0,
                "creator.refreshToken": 0,
                "creator.password": 0,
                "creator.projects": 0,
                "creator.uuid": 0,
                "creator.profile.sports": 0,
                "creator.profile.skills": 0,
                creatorId: 0
            }
        }
    ]);


    if (!projects)
        return next(new CustomError("There is Some Thing Went Wrong", 401));
    else
        return res.success(200, "Explore Projects", { totalPages, projects })
}

module.exports = { exploreProjects }