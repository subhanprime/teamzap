const CustomError = require('../errors/customError.js');
const User = require('../models/User.js');
const searchCreative = async (req, res, next) => {
    const { page } = req?.query;
    const { search } = req.params;

    if (!search)
        return next(new CustomError("Please Provide some For Search", 401));
    const perPage = 15;
    const currentPage = page || 1;
    const skip = (currentPage - 1) * perPage;

    const query = {
        role: "creative",
        $or: [
            { "profile?.firstName": { $regex: search, $options: "i" } },
            { "profile?.lastName": { $regex: search, $options: "i" } },
            { "profile?.fullName": { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
            // { bio: { $regex: search, $options: "i" } },
        ],
    };

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const response = await User.find(query, { __v: 0, refreshToken: 0, password: 0, })
        .skip(skip)
        .limit(perPage)
        .sort({ createdDate: -1 })
        .exec();

    if (response)
        return res.success(200, "Results According to Search", {
            totalPages,
            response,
        });
    else
        return next(new CustomError("Something Went Wrong", 401));

}


module.exports = { searchCreative }