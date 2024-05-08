const CustomError = require('../errors/customError.js');
const User = require('../models/User.js');
const { uploadFile } = require('../aws/aws.js');

const updateUser = async (req, res, next) => {
    console.log('update user', req.body)
    try {
        const userId = req.userId;
        const updateObject = {};
        const files = req?.files?.files;
        const avatarFiles = req?.files?.avatar;
        const avatar = avatarFiles ? avatarFiles[0] : null;
        const { firstName, lastName, fullName, location, sports, hourlyRate, biography, title, pinnedReview } = req.body;

        if (firstName) updateObject.profile['firstName'] = firstName;
        if (lastName) updateObject['profile.lastName'] = lastName;
        if (fullName) updateObject['profile.fullName'] = fullName;
        if (location) updateObject['profile.location'] = location;
        if (sports) updateObject['profile.sports'] = sports;
        if (hourlyRate) updateObject['profile.hourlyRate'] = hourlyRate;
        if (biography) updateObject['profile.biography'] = biography;
        if (title) updateObject['profile.title'] = title;
        if (pinnedReview) updateObject['pinnedReview'] = pinnedReview;


        let uploadedUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                let type;
                if (file.mimetype === 'image/jpeg') type = "image/jpeg";
                else if (file.mimetype === 'image/png') type = "image/png";
                else {
                    return false;
                }
                const url = await uploadFile(file.buffer);
                uploadedUrls.push({ fileType: type, url });
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                { $push: { portfolio: { $each: uploadedUrls } } },
                { new: true }
            )
        }


        let avatarLink = '';
        if (avatar) {
            let type;
            if (avatar.mimetype === 'image/jpeg') type = "image/jpeg";
            else if (avatar.mimetype === 'image/png') type = "image/png";
            else return false;
            const url = await uploadFile(avatar.buffer);
            avatarLink = url
        }

        if (avatarLink !== '')
            updateObject["profile.avatar"] = avatarLink;
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateObject },
            { new: true }
        ).select({
            refreshToken: 0,
            password: 0,
            __v: 0
        });
        if (!updatedUser) {
            return next(new CustomError("User Not Found", 401));
        }

        return res.success(201, "User Updated Successfully", updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return next(new CustomError("Internal Server Error", 500));
    }
}

module.exports = { updateUser };
