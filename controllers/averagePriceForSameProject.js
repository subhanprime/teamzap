const mongoose = require("mongoose");
const CustomError = require("../errors/customError.js");
const Project = require("../models/Project.js");
const Skill = require("../models/Skill.js");
const averagePriceForSameProject = async (req, res, next) => {
    const { skills } = req.query;

    if (!skills)
        return next(new CustomError('Please provide Skills', 401));

    const allSkills = skills.split(',');


    let skillsFind = await Skill.find({ _id: { $in: allSkills } })
    skillsFind = skillsFind.map(el => el.name)


    const filteredRecord = await Project.aggregate([
        {
            $lookup: {
                from: "skills",
                localField: "skillsRequired",
                foreignField: "_id",
                as: "skills"
            }
        },
        {
            $addFields: {
                "skillsName": {
                    $map: {
                        input: "$skills",
                        as: "skill",
                        in: "$$skill.name"
                    }
                }
            }
        },
        {
            $match: {
                $or: [
                    { skillsName: { $in: skillsFind } },
                ]
            }
        },
        {
            "$group": {
                _id: null,
                total_projects: { $sum: 1 },
                average_Price: { $avg: "$maxRate" },
                max_Price: { $max: "$maxRate" },
                min_Price: { $min: "$minRate" },
                max_average_price: { $avg: "$maxRate" },
                min_average_price: { $avg: "$minRate" },
            }
        },
        {
            "$project": {
                _id: 0,
            }
        }

    ]);
    if (filteredRecord[0])
        res.success(201, "average price for same project", filteredRecord[0]);
    

}






const userAveragePriceForSameProject = async (req, res, next) => {

        const { skills } = req.query;

        if (!skills)
            return next(new CustomError('Please provide Skills', 401));
        
        const allSkills = skills.split(',');
        let skillsFind = await Skill.find({ _id: { $in: allSkills } })
        skillsFind = skillsFind.map(el => el.name)


        const filteredRecord = await Project.aggregate([
            {
                $match: {
                    creativeId: new mongoose.Types.ObjectId(req.userId)
                }
            },
            {
                $lookup: {
                    from: "skills",
                    localField: "skillsRequired",
                    foreignField: "_id",
                    as: "skills"
                }
            },
            {
                $addFields: {
                    "skillsName": {
                        $map: {
                            input: "$skills",
                            as: "skill",
                            in: "$$skill.name"
                        }
                    }
                }
            },
            {
                $match: {
                    $or: [
                        { skillsName: { $in: skillsFind } },
                    ]
                }
            },
            {
                "$group": {
                    _id: null,
                    total_projects: { $sum: 1 },
                    average_Price: { $avg: "$maxRate" },
                    max_Price: { $max: "$maxRate" },
                    min_Price: { $min: "$minRate" },
                    max_average_price: { $avg: "$maxRate" },
                    min_average_price: { $avg: "$minRate" },
                }
            },
            {
                "$project": {
                    _id: 0,
                }
            }

        ]);
       
            res.success(201, "User average price for same project",  filteredRecord[0] ? filteredRecord[0] : null);

}

module.exports = { averagePriceForSameProject, userAveragePriceForSameProject }