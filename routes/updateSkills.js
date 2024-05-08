// routes/updateSkills.js

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model
const router = express.Router();
const verifyJwt = require("../middleware/verifyJwt.js");

router.put("/", verifyJwt, async (req, res) => {
  try {
    console.log("updateSkills api called ");
    const { skills } = req.body;
    // console.log("req?.userId update skills", req?.userId);
    const user = await User.findOneAndUpdate(
      { _id: req?.userId },
      { $set: { "profile.skills": skills } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Skills updated successfully", user });
  } catch (error) {
    console.error("Error updating skills:", error);
    res.status(500).json({ error: "An error occurred while updating skills" });
  }
});

module.exports = router;
