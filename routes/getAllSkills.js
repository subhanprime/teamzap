// routes/getAllSkills.js

const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allSkills = await Skill.find({});
    res.status(200).json(allSkills);
  } catch (error) {
    console.error('Error fetching all skills:', error);
    res.status(500).json({ error: 'An error occurred while fetching skills' });
  }
});

module.exports = router;
