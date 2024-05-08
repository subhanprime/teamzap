const Project = require("../models/Project.js");
const handleSearch = async (req, res) => {
  const { page } = req?.query;
  const { search } = req.params;

  const perPage = 15;
  const currentPage = page || 1;
  const skip = (currentPage - 1) * perPage;

  const query = {
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  };
  const pipeline = [
    {
      $match: {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creatorId",
        foreignField: "_id",
        as: "creator"
      }
    },

    {
      $unwind: "$creator"
    },


    {
      $project: {
   
        __v: 0,
        proposals:0,
        creatorId:0,
        skillsRequired:0,
        "creator.password":0,
        "creator.portfolio":0,
        "creator.projects":0,
        "creator.favoriteCreativeOfAthleteList":0,
        "creator.resetToken":0,
        "creator.isAccountVerified":0,
        "creator.accountVerifiedToken":0,
        "creator.refreshToken":0,
        "creator.createdDate":0,
        "creator.uuid":0,
        "creator.role":0,
        "creator.profile.skills":0, 
        "creator.profile.sports":0, 
        "creator.profile.ratePerHour":0, 
        "creator.profile.hourlyRate":0, 
        "creator._id":0, 
        // "creator?.hourlyRate":0, 

      },
    },
  ];

  const totalCount = await Project.countDocuments(query);
  const totalPages = Math.ceil(totalCount / perPage);
  const response = await Project.aggregate(pipeline)
    .skip(skip)
    .limit(perPage)
    .sort({ createdDate: -1 })
    .exec();

  return res.success(200, "Results According to Search", {
    totalPages,
    response,
  });
};

module.exports = { handleSearch };
