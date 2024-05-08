const express = require('express');
const Skill = require('../models/Skill');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newSkill = await Skill.create({ name });

    res.status(201).json({ message: 'Skill added successfully', newSkill });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'An error occurred while adding the skill' });
  }
});

module.exports = router;
