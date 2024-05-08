const User = require('../models/User.js');
const CustomError = require('../errors/customError.js');
const updateBio = async (req, res, next) => {
    const { biography, location, title } = req.body;

    const existingUser = await User.findById(req.userId);

    if (!existingUser) {
        return next(new CustomError('User not found', 404));
    }

    if (biography) existingUser.profile.biography = biography;
    if (location) existingUser.profile.location = location;
    if (title) existingUser.profile.title = title;

    const updatedUser = await existingUser.save();

    if (updatedUser)
        res.success(201, "Updated Bio Successfully", updatedUser)
    else
        return next(new CustomError('Bio Not Updated', 401));
}


module.exports = { updateBio };