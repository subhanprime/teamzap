const User = require("../models/User.js");
const CustomError = require("../errors/customError.js");
const favoriteList = async (req, res, next) => {
  const { userId, status } = req?.body;
  // console.log(req?.body?.userId);

  if (!userId)
    return next(
      new CustomError("Please Provide Valid userId", 400)
    );
  let updateQuery = {};

  if (status)
    updateQuery = {
      $addToSet: { favoriteCreativeOfAthleteList: userId }
    };
  else
    updateQuery = {
      $pull: { favoriteCreativeOfAthleteList: userId }
    };



  const response = await User.findOneAndUpdate(
    {
      _id: req?.userId,
      role: "athlete",
      // favoriteCreativeOfAthleteList: { $ne: userId },
    },
    updateQuery,
    { projection: { password: 0, refreshToken: 0 }, new: true }
  );

  if (!response) {
    return next(
      new CustomError("Athlete User Not Found or Creative Already Added", 401)
    );
  }
  let sts = status ? 'added' : 'remove'
  res.success(
    200,
    `Favorite Creative ${sts} Successfully To The List`,
    response
  );
};

module.exports = { favoriteList };
