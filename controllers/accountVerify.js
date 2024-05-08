const User = require('../models/User.js');
const CustomError = require('../errors/customError.js');

const accountVerify = async (req, res, next) => {
    const { token, email } = req?.query;

    if (!token || !email) {
        return next(new CustomError('You are not allowed for this', 401));
    }

    const isValid = await User.findOneAndUpdate({ email, accountVerifiedToken: token, isAccountVerified: false }, { $set: { isAccountVerified: true, accountVerifiedToken: null } }, { new: true });

    if (isValid) {
        // Success message
        const successMessage = `
            <html>
                <head>
                    <style>
                        /* Add your CSS styles here */
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                        }
                        .message-container {
                            text-align: center;
                            padding: 20px;
                            background-color: #4CAF50;
                            color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                        }
                        .success-message {
                            font-size: 24px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="message-container">
                        <p class="success-message">Account Verified Successfully!</p>
                        <p>Your account has been verified. You can now log in.</p>
                    </div>
                </body>
            </html>
        `;
        res.send(successMessage);
    } else {
        // Error message
        const errorMessage = `
            <html>
                <head>
                    <style>
                        /* Add your CSS styles here */
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                        }
                        .message-container {
                            text-align: center;
                            padding: 20px;
                            background-color: #f44336;
                            color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                        }
                        .error-message {
                            font-size: 24px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="message-container">
                        <p class="error-message">Account Verification Failed!</p>
                        <p>This verification link is not valid. Please check your email for the correct link.</p>
                    </div>
                </body>
            </html>
        `;
        res.send(errorMessage);
    }
};

module.exports = { accountVerify };
