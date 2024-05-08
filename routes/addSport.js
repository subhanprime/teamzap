const express = require('express');
const Sport = require('../models/Sport');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newSport = await Sport.create({ name });
    res.status(201).json({ message: 'Sport added successfully', newSport });
  } catch (error) {
    console.error('Error adding sport:', error);
    res.status(500).json({ error: 'An error occurred while adding the sport' });
  }
});

module.exports = router;
