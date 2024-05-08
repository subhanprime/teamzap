const User = require('../models/User.js');
const CustomError = require('../errors/customError.js');
const mongoose = require('mongoose');
const getUser = async (req, res, next) => {

    const foundUser = await User.findOne({ _id: req.userId }, { refreshToken: 0, password: 0, __v: 0 }).populate('profile.skills')?.populate('pinnedReview');;

    return res.success(201, "get Login User details", foundUser)


}


const specificUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userAggregate = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) }
            },
            {
                $project: {
                    refreshToken: 0,
                    password: 0,
                    __v: 0
                }
            },
            {
                $lookup: {
                    from: 'skills',
                    localField: 'profile.skills',
                    foreignField: '_id',
                    as: 'profile.skills'
                }
            },
            {
                $lookup: {
                    from: 'ratings',
                    localField: 'pinnedReview',
                    foreignField: '_id',
                    as: 'pinnedReview'
                }
            },
            {
                $unwind: {
                    path: '$pinnedReview',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    pinnedReviewDate: {
                        $dateToString: {
                            date: { $ifNull: ["$pinnedReview.updatedAt", new Date()] },
                            format: "%m %d, %Y"
                        }
                    }
                }
            },
            {
                $addFields: {
                    monthIndex: { $month: { $ifNull: ["$pinnedReview.updatedAt", new Date()] } }
                }
            },
            {
                $addFields: {
                    monthName: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$monthIndex", 1] }, then: "January" },
                                { case: { $eq: ["$monthIndex", 2] }, then: "February" },
                                { case: { $eq: ["$monthIndex", 3] }, then: "March" },
                                { case: { $eq: ["$monthIndex", 4] }, then: "April" },
                                { case: { $eq: ["$monthIndex", 5] }, then: "May" },
                                { case: { $eq: ["$monthIndex", 6] }, then: "June" },
                                { case: { $eq: ["$monthIndex", 7] }, then: "July" },
                                { case: { $eq: ["$monthIndex", 8] }, then: "August" },
                                { case: { $eq: ["$monthIndex", 9] }, then: "September" },
                                { case: { $eq: ["$monthIndex", 10] }, then: "October" },
                                { case: { $eq: ["$monthIndex", 11] }, then: "November" },
                                { case: { $eq: ["$monthIndex", 12] }, then: "December" }
                            ],
                            default: "Unknown"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    userImage: 1,
                    portfolio: 1,
                    ratingStars: 1,
                    profile: 1,
                    role: 1,
                    email: 1,
                    pinnedReview: { $ifNull: ["$pinnedReview.feedback", "No pinned review"] },
                    pinnedReviewDate: {
                        $concat: ["$monthName", " ", { $substr: ["$pinnedReviewDate", 2, -1] }]
                    }
                }
            }
        ]);

        if (userAggregate.length > 0) {
            return res.success(201, "get Login User details", userAggregate[0]);
        } else {
            throw CustomError("User Not Found", 401);
        }
    } catch (error) {
        next(error);
    }
}






module.exports = { getUser, specificUser }