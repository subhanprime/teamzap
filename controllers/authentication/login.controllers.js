const bcrypt = require("bcrypt");
const User = require("../../models/User");
const createTokens = require("../../helpers/createTokens.js");
const CustomError = require("../../errors/customError.js")

const loginHandler = async (req, res, next) => {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email }, { __v: 0 });
    if (!email || !password)
        return next(new CustomError("Please Provide All Credentails", 401))

    if (!foundUser)
        return next(new CustomError("Invalid credentials", 401))

    if (!foundUser?.isAccountVerified)
        return next(new CustomError("Please Verify Your Account First", 401))

    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatch) {
        return next(new CustomError("Invalid credentials", 401))
    }

    const { accessToken, refreshToken } = createTokens({
        userId: foundUser?._id,
        role: foundUser?.role,
        email: foundUser?.email
    })

    foundUser.refreshToken = refreshToken;
    await foundUser.save();
    return res.success(200, "Login successful!", { foundUser, accessToken, refreshToken })
}


module.exports = loginHandler;