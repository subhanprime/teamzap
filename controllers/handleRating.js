const CustomError = require('../errors/customError.js');
const Project = require('../models/Project.js');
const User = require('../models/User.js');
const Ratings = require("../models/Rating.js");
const mongoose = require('mongoose');
const AthleteReview = require('../models/athleteReview.js');

const handleRating = async (req, res, next) => {
    console.log('handleRatin')
    const { projectId, creativeId, ratingPoint, feedBack } = req.body;
    let feedbackValue = feedBack ? feedBack : null;

    if (!projectId || !creativeId || !ratingPoint)
        return next(new CustomError('Please Provide All Credentials', 401));

    const foundProject = await Project.findOne({ creatorId: req.userId, creativeId, status: "completed" });


    if (!foundProject) {
        return next(new CustomError('You Are Not Able To give review this', 400));
    }

    const parsedRatingPoint = parseInt(ratingPoint, 10);

    if (isNaN(parsedRatingPoint) || parsedRatingPoint < 1 || parsedRatingPoint > 5) {
        return next(new CustomError('Invalid ratingPoint. Please provide a rating between 1 and 5.', 400));
    }

    const findRating = await Ratings.findOne({ projectId, creativeId, athleteId: req.userId });

    if (findRating) {

        const updateRates = await Ratings.findOneAndUpdate(
            { projectId, creativeId, athleteId: req.userId },
            { $set: { ratingPoint: parsedRatingPoint, feedback: feedbackValue } },
            { new: true }
        );


        if (updateRates) {
            const totalStars = await Ratings.aggregate([
                {
                    $match: {
                        creativeId: new mongoose.Types.ObjectId(creativeId)
                    }

                },
                {
                    $group: {
                        _id: "$creativeId",
                        ratingStars: { $avg: "$ratingPoint" }
                    }
                }

            ]);

            let ratingValue = totalStars[0].ratingStars.toFixed(1);

            await User.findOneAndUpdate({ _id: creativeId }, { $set: { ratingStars: ratingValue } });

            return res.success(201, "Rating Updates Successfully", updateRates);
        }
        else
            return next(new CustomError('Some thing went wrong to update ratings', 401));

    } else {

        const createRatings = await Ratings.create({ projectId, creativeId, athleteId: req.userId, ratingPoint: parsedRatingPoint, feedback: feedbackValue });
        if (createRatings) {
            const totalStars = await Ratings.aggregate([
                {
                    $match: {
                        creativeId: new mongoose.Types.ObjectId(creativeId)
                    }

                },
                {
                    $group: {
                        _id: "$creativeId",
                        ratingStars: { $avg: "$ratingPoint" }
                    }
                }

            ]);

            let ratingValue = totalStars[0].ratingStars;
            await User.findOneAndUpdate({ _id: creativeId }, { $set: { ratingStars: ratingValue } });
            return res.success(201, "Rating Create Successfully", createRatings);
        }
        else
            return next(new CustomError('Some thing went wrong to create ratings', 401))
    }

};


const userRatings = async (req, res, next) => {
    const { creativeId } = req.params;
    const ratingsList = await Ratings.aggregate([
        {
            $match: {
                creativeId: new mongoose.Types.ObjectId(creativeId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'athleteId',
                foreignField: "_id",
                as: 'athlete'
            }
        },
        {
            $unwind: "$athlete"
        },



        {
            $project: {

                ratingPoint: 1,
                feedback: 1,
                updatedAt: {
                    $dateToString: {
                        date: "$updatedAt",
                        format: "%Y-%m-%d %H:%M:%S"
                    }
                },
                userName: "$athlete.profile.fullName",
            }

        }

    ]);

    if (ratingsList)
        return res.success(201, 'user ratings', ratingsList);
    else
        return next(new CustomError('There is no Rating Found', 401))
};


const userRatingsStars = async (req, res, next) => {
    const { creativeId } = req.params;
    const ratingsStars = await Ratings.aggregate([

        {
            $group: {
                _id: new mongoose.Types.ObjectId(creativeId),
                ratingStars: { $avg: { ratingPoint } }
            }
        }
    ])


    if (ratingsStars)
        return res.success(201, 'user ratings', ratingsStars[0]);
    else
        return next(new CustomError('There is no Rating Found', 401))

}



const addAthleteReview = async (req, res, next) => {

    try {

        const { projectId, athleteId, ratingPoint, feedBack } = req.body;
        let feedbackValue = feedBack ? feedBack : null;

        if (!projectId || !athleteId || !ratingPoint)
            return next(new CustomError('Please Provide All Credentials', 401));

        const foundProject = await Project.findOne({ creatorId: athleteId, creativeId: req.userId, status: "completed" });
     
        if (!foundProject) {
            return next(new CustomError('You Are Not Able To give review this', 400));
        }

        const parsedRatingPoint = parseInt(ratingPoint, 10);

        if (isNaN(parsedRatingPoint) || parsedRatingPoint < 1 || parsedRatingPoint > 5) {
            return next(new CustomError('Invalid ratingPoint. Please provide a rating between 1 and 5.', 400));
        }

        const findRating = await AthleteReview.findOne({ projectId, creativeId: req.userId, athleteId });

        if (findRating) {

            const updateRates = await AthleteReview.findOneAndUpdate(
                { projectId, creativeId: req.userId, athleteId },
                { $set: { ratingPoint: parsedRatingPoint, feedback: feedbackValue } },
                { new: true }
            );


            if (updateRates) {
                const totalStars = await AthleteReview.aggregate([
                    {
                        $match: {
                            athleteId: new mongoose.Types.ObjectId(athleteId)
                        }

                    },
                    {
                        $group: {
                            _id: "$athleteId",
                            ratingStars: { $avg: "$ratingPoint" }
                        }
                    }

                ]);

                let ratingValue = totalStars[0].ratingStars.toFixed(1);

                await User.findOneAndUpdate({ _id: athleteId }, { $set: { ratingStars: ratingValue } });

                return res.success(201, "Rating Updates Successfully", updateRates);
            }
            else
                return next(new CustomError('Some thing went wrong to update ratings', 401));

        } else {

            const createRatings = await AthleteReview.create({ projectId, creativeId: req.userId, athleteId, ratingPoint: parsedRatingPoint, feedback: feedbackValue });
            if (createRatings) {
                const totalStars = await AthleteReview.aggregate([
                    {
                        $match: {
                            athleteId: new mongoose.Types.ObjectId(athleteId)
                        }

                    },
                    {
                        $group: {
                            _id: "$athleteId",
                            ratingStars: { $avg: "$ratingPoint" }
                        }
                    }

                ]);

                let ratingValue = totalStars[0].ratingStars;
                await User.findOneAndUpdate({ _id: athleteId }, { $set: { ratingStars: ratingValue } });
                return res.success(201, "Rating Create Successfully", createRatings);
            }
            else
                return next(new CustomError('Some thing went wrong to create ratings', 401))
        }

    } catch (err) { console.log(err) }
}

module.exports = { handleRating, userRatings, userRatingsStars, addAthleteReview };
