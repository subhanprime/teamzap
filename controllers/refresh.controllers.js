const jwt = require("jsonwebtoken");
const userModal = require("../models/User.js");
const CustomError = require("../errors/customError.js");
const refreshToken = async (req, res) => {
    const refreshToken = req?.params?.refresh;
    const foundUser = await userModal.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(409);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || decoded?.userInfo?.email != foundUser?.email) {
            return next(new CustomError("token is not valid", 409));
        }
        const token = jwt.sign(
            {
                userInfo: {
                    email: decoded?.userInfo?.email,
                    userId: decoded?.userInfo?.userId,
                    role: decoded?.userInfo?.role,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "360s" }
        );
        res.success(200, "accessToken Create Successfully", { accessToken: token });
    });
};

module.exports = refreshToken;
