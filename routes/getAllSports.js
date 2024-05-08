// routes/getAllSports.js

const express = require('express');
const Sport = require('../models/Sport');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const allSports = await Sport.find({});
    res.status(200).json(allSports);
  } catch (error) {
    console.error('Error fetching all sports:', error);
    res.status(500).json({ error: 'An error occurred while fetching sports' });
  }
});

module.exports = router;
