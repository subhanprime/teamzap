const User = require('../models/User.js')
const CustomError = require('../errors/customError.js');
const mongoose = require('mongoose');
const athleteFavoriteCreative = async (req, res, next) => {



    const users = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.userId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: "favoriteCreativeOfAthleteList",
                foreignField: "_id",
                as: "favList"
            }
        },
        {
            $unwind: "$favList"
        },
        {
            $project: {
                _id:0,
                'username': "$favList.username",
                'id': "$favList._id",
                'email': "$favList.email",
                'fullName': "$favList.profile.fullName",
                'avatar': "$favList.profile.avatar",
                'hourlyRate': "$favList.profile.hourlyRate",
                'location': "$favList.profile.location",
                'title': "$favList.profile.title",
                'ratingStars': "$favList.ratingStars",

            }

        }
    ])

    res.success(201, 'athleteFavoriteCreative', users)
}


module.exports = { athleteFavoriteCreative }