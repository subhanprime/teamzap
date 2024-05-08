// routes/refreshToken.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model
const verifyJwt = require("../middleware/verifyJwt");
const router = express.Router();
// const verifyJwt = require("../middleware/verifyJwt");

router.get("/", verifyJwt, async (req, res) => {
  try {
    // const { authorization } = req.headers;
    // console.log("refreshToken called");
    // if (!authorization || !authorization.startsWith("Bearer ")) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }

    // const token = authorization.split(" ")[1];

    // // Verify and decode the token
    // const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decodedToken);
    // Fetch the user details from the database
    const user = await User.findOne({ _id: req?.userId });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Generate a new JWT token with an extended expiration
    // const newToken = jwt.sign(
    //   {
    //     userId: user.uuid,
    //     role: user.role,
    //   },
    //   "your-secret-key",
    //   { expiresIn: "2h" } // Extend the token expiration time as needed
    // );

    res.status(200).json({ user});
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({ error: "An error occurred during token refresh" });
  }
});

module.exports = router;
