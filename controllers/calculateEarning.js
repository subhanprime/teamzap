const CustomError = require('../errors/customError.js');
const User = require('../models/User.js');
const Project = require('../models/Project.js');
const mongoose = require('mongoose');

const earningProjectWise = async (req, res, next) => {
    const foundUser = await User.aggregate([

        {
            "$match": {
                _id: new mongoose.Types.ObjectId(req?.userId)
            }
        },
        {
            "$lookup": {
                from: "projects",
                localField: "projects",
                foreignField: "_id",
                as: "ProjectsList"
            }
        },

        {
            "$set": {
                "filteredProjects": {
                    $map: {
                        input: {
                            $filter: {
                                input: "$ProjectsList",
                                as: "project",
                                cond: { $eq: ["$$project.status", "completed"] }
                            }
                        },
                        as: "project",
                        in: "$$project"
                    }
                }
            }

        },
        {
            "$unwind": {
                path: "$filteredProjects"
            }
        },
        {

            "$group": {
                _id: "$filteredProjects?._id",
                total_completed_project: { $sum: 1 },
                total_earning: { $sum: "$filteredProjects.payment.totalAmount" },
                list_of_projects: {
                    $push:
                    {
                        amount: "$filteredProjects.payment.totalAmount",
                        title: "$filteredProjects.title",
                        description: "$filteredProjects.description",
                        createdDate: "$filteredProjects.createdDate"
                    }
                },
            }
        },


        { "$unset": ["ProjectsList", "_id"] }
    ])
    return res.success(201, "list project wise earning", foundUser[0]);
}

module.exports = { earningProjectWise }