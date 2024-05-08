const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createTokens = require("../../helpers/createTokens.js");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/User");
const { uploadFile } = require('../../aws/aws.js');
const CustomError = require('../../errors/customError.js');
const sgMail = require('@sendgrid/mail');
const { URL } = require('../../utils/url.js');
const { createOrRetrieveCustomer } = require('../handleStripe.js')

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

const handleRegister = async (req, res) => {

  try {
    sgMail.setApiKey(process.env.SEND_GRID_KEY);

    const { email, password, fullName, username, role } = req.body;
    const file = req.file;
    if (!email || !password || !fullName || !username || !role)
      return res
        .status(400)
        .json({ error: "Please Provide All Credentials" });

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail !== null) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      return res
        .status(400)
        .json({ error: "User with this username already exists" });
    }

    let uploadedUrl = "";
    if (file)
      if (file?.mimetype == 'image/jpeg' || file?.mimetype == 'image/png') {
        const url = await uploadFile(file.buffer);
        uploadedUrl = url;
      }
    const token = generateRandomID();
    const fullNameArray = fullName.split(" ");
    const firstName = fullNameArray[0];
    const lastName = fullNameArray[1];
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv4();

    const link = `${URL}/VerifyAccount?token=${token}&email=${email}`;

    const msg = {
      to: email,
      from: process.env.SEND_GRID_EMAIL,
      subject: `TeamedApp - Verify Account`,
      text: `Email is sending from TeamedApp.`,
      html: `
                <div style="text-align: center; background-color: #f4f4f4; padding: 20px;">
                    <h2>Verify Account</h2>
                    <p>You've requested to Verify your Account on TeamedApp. Click the button below to Verify it.</p>
                    <p>Please don't share with anyone</p>
                    <a href="${link}" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Verify Your Account</a>
                </div>
            `,
    };
    // const stripe = await createOrRetrieveCustomer(email, fullName);.

    const newUser = new User({
      uuid,
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
        fullName,
        avatar: uploadedUrl,
      },
      accountVerifiedToken: token,
      username,
      role,
      // stripeAccountId: stripe.id
    });
    const userRegister = await newUser.save();

    const { accessToken, refreshToken } = createTokens({
      role,
      email,
      userId: newUser?._id,
    });

    newUser.refreshToken = refreshToken;
    await newUser.save();

    await sgMail.send(msg);

    if (userRegister)
      return res.success(201, "Please Check Your Mail and Verify Your Account", {
        newUser,
        accessToken,
        refreshToken,
      });
    else
      return next(new CustomError('User Registration Failed', 401))
  } catch (err) {
    console.log('err', err)
  }
};

module.exports = handleRegister;
