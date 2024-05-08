const User = require('../models/User.js');
const _ = require('lodash');
const mongoose = require('mongoose')
const userRelativeCreative = async (req, res, next) => {
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
                userSkills: "$userSkills.name",
                favoriteCreativeOfAthleteList: 1,
            }
        }
    ]);

    if (!user)
        return next(new CustomError("There is Some Thing Went Wrong", 401));
    const userSkills = user[0]?.userSkills || [];
    const favoriteCreativeOfAthleteList = user[0]?.favoriteCreativeOfAthleteList || [];

    const page = req?.query?.page || 1;
    const perPage = 10;


    const totalUsersCountQuery = User.aggregate([
        {
            $match: { _id: { $ne: mongoose.Types.ObjectId.createFromHexString(req?.userId) }, role: 'creative' },
        },
        {
            $count: 'totalUsersCount',
        },
    ]);

    const [totalUsersCountResult] = await totalUsersCountQuery;

    const totalUsersCount = totalUsersCountResult ? totalUsersCountResult.totalUsersCount : 0;

    const totalPages = Math.ceil(totalUsersCount / perPage);

    const creativeUserList = await User.aggregate([
        {
            $match: { _id: { $ne: mongoose.Types.ObjectId.createFromHexString(req?.userId) }, role: 'creative' },
        },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "creativeId",
                as: "ratings"
            }
        },
        {
            $lookup: {
                from: 'skills',
                localField: 'profile.skills',
                foreignField: '_id',
                as: 'userSkills',
            },
        },
        {
            $addFields: {
                ratingStars: {
                    $ifNull: [{ $avg: "$ratings.ratingPoint" }, 0]
                }
            }
        },
        {
            $addFields: {
                matchingSkills: {
                    $filter: {
                        input: '$userSkills',
                        as: 'skill',
                        cond: { $in: ['$$skill.name', userSkills] },
                    },
                },
                matchingSkillsCount: {
                    $size: { $ifNull: ['$matchingSkills', []] }
                },
                athleteHasLiked: { $in: ['$_id', favoriteCreativeOfAthleteList] }
            },
        },
        {
            $sort: { matchingSkillsCount: -1 },
        },
        {
            $lookup: {
                from: 'skills',
                localField: 'matchingSkills._id',
                foreignField: '_id',
                as: 'matchingSkills',
            },
        },
        {
            $project: {
                // ratings: 1,
                uuid: 1,
                username: 1,
                email: 1,
                role: 1,
                profile: 1,
                projects: 1,
                createdDate: 1,
                matchingSkillsCount: 1,
                refreshToken: { $cond: [{ $ifNull: ['$refreshToken', false] }, '$refreshToken', '$$REMOVE'] },
                password: { $cond: [{ $ifNull: ['$password', false] }, '$password', '$$REMOVE'] },
                athleteHasLiked: 1,
                ratingStars: 1
            },
        },
        {
            $skip: (page - 1) * perPage,
        },
        {
            $limit: perPage,
        },
    ]);

    const sanitizedUsers = creativeUserList.map(user => _.omit(user, ['refreshToken', 'password']));

    res.success(201, "Relative creativeUser to athlete", { totalPages, creativeUsers: sanitizedUsers });
}

module.exports = { userRelativeCreative };