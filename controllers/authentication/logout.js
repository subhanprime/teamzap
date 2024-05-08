const User = require("../../models/User.js");
const CustomError = require("../../errors/customError.js");
const logoutHandler = async (req, res, next) => {
    if (!req.userId)
        return next(new CustomError("Please use Valid Credentials", 401));
    const currentDateTime = new Date();
    const foundUser = await User.findOneAndUpdate({ _id: req.userId }, { $set: { refreshToken: `${currentDateTime}` } }, { new: true });
    if (foundUser)
        return res.success(200, "You Logout Successfully");
    else
        return next(new CustomError("Some Thing went wrong", 401));

}

module.exports = logoutHandler; 