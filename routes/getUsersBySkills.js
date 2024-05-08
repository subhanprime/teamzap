// routes/getUsersBySkills.js

const express = require('express');
const User = require('../models/User'); // Import your User model
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({ error: 'Skills parameter is required' });
    }

    const skillsArray = skills.split(','); // Split the skills into an array

    // Find users with any of the specified skills
    const usersWithSkills = await User.find({ 'profile.skills': { $in: skillsArray } });

    res.status(200).json(usersWithSkills);
  } catch (error) {
    console.error('Error fetching users by skills:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

module.exports = router;
