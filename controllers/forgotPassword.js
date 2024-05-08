const User = require('../models/User.js');
const CustomError = require("../errors/customError.js");
const sgMail = require('@sendgrid/mail');
const { FE_URL } = require('../utils/url.js');
const bcrypt = require("bcrypt");

function generateRandomID() {
    const length = Math.floor(Math.random() * 5) + 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }

    return randomID;
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        sgMail.setApiKey(process.env.SEND_GRID_KEY);
        const resetToken = generateRandomID();

        const foundUser = await User.findOneAndUpdate({ email }, { $set: { resetToken } });

        if (!foundUser)
            return next(new CustomError('Account Dose not Exist', 401));

        const link = `${FE_URL}/resetPassword?token=${resetToken}&email=${email}`;

        const msg = {
            to: email,
            from: process.env.SEND_GRID_EMAIL,
            subject: `TeamedApp - Password Reset`,
            text: `Email is sending from TeamedApp.`,
            html: `
                <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
                    <h2>Password Reset Link</h2>
                    <p>You've requested to reset your password for TeamedApp. Click the button below to reset it.</p>
                    <p>Please don't share with anyone</p>
                    <a href="${link}" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Your Password</a>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
            return res.success(201, "Password reset email sent successfully")
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const resetPassword = async (req, res, next) => {

    const { token, email, password, confirmPassword } = req.body;

    if (!token, !email) {
        return next(new CustomError('Please Provide Valid Credentials', 401));
    }

    const foundUser = await User.findOne({ email, resetToken: token });
    if (!foundUser)
        return next(new CustomError('You are not Eligible For this', 401));


    if (password != confirmPassword)
        return next(new CustomError('Password is not Correct You Provide', 401));
    const passwordMatch = await bcrypt.compare(password, foundUser.password);

    if (passwordMatch)
        return next(new CustomError('You can not used previous Password', 401));

    const hashedPassword = await bcrypt.hash(password, 10);
    const passwordReset = await User.findOneAndUpdate({ email, resetToken: token }, { $set: { password: hashedPassword } }, { new: true });

    if (passwordReset)
        return res.success(201, 'Password Reset SuccessFully');
    else
        return next(new CustomError('Password Reset Failed', 401));
}

module.exports = { forgotPassword, resetPassword };
