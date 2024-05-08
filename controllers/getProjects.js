
const Project = require('../models/Project.js');
const mongoose = require('mongoose')

const getProjects = async (req, res, next) => {
    const { projectId } = req.params;
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $lookup: {
                from: 'skills',
                localField: 'skillsRequired',
                foreignField: '_id',
                as: 'skillsRequired',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'creatorId',
                foreignField: '_id',
                as: 'creatorId',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'creativeId',
                foreignField: '_id',
                as: 'creative',
            },
        },
        {
            $lookup: {
                from: 'proposals',
                localField: 'proposals',
                foreignField: '_id',
                as: 'newProposal',
            },
        },
        {
            $addFields: {
                debugProposals: {
                    $map: {
                        input: "$newProposal",
                        as: "proposal",
                        in: "$$proposal.creativeId"
                    }
                }
            }
        },
        {
            $addFields: {
                hasDebugProposals: {
                    $cond: {
                        if: { $isArray: "$debugProposals" },
                        then: { $gt: [{ $size: "$debugProposals" }, 0] },
                        else: false,
                    }
                }
            }
        },
        {
            $addFields: {
                isProposalSubmit: {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(req?.userId), // Convert req.userId to ObjectId
                                { $map: { input: "$newProposal", as: "proposal", in: "$$proposal.creativeId" } } // Extract creativeIds
                            ]
                        },
                        then: true, // If there's a match, set to true
                        else: false, // If there's no match, set to false
                    }
                }
            }
        },



        {
            $unwind: '$creatorId',
        },
        {
            $unwind: {
                path: '$creative',
                preserveNullAndEmptyArrays: true // Preserve documents with empty creative arrays
            }
        },
        // {
        //     $match: {
        //         creative: { $exists: true } // Filter out documents where creative array is empty or non-existent
        //     }
        // },


        {
            "$project": {
                "creatorId?.refreshToken": 0,
                "creative?.refreshToken": 0,
                "creatorId.__v": 0,
                "creative?.__v": 0,
                "creatorId?.profile.sports": 0,
                "creative?.profile.sports": 0,
                "creatorId?.profile.skills": 0,
                "creative?.profile.skills": 0,
                "creatorId?.password": 0,
                "creative?.password": 0,
                "skillsRequired?.uuid": 0,
                "skillsRequired?.__v": 0,
                "proposals": 0,
                "newProposal": 0
            }
        }




    ];

    const project = await Project.aggregate(pipeline);
    // console.log('project', project)
    if (project.length === 0) {
        return res.status(401).json({ error: 'Project not found' });
    }

    res.status(200).json(project[0]);
}

module.exports = { getProjects }