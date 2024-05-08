// routes/updateSports.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model
const verifyJwt = require('../middleware/verifyJwt');
const router = express.Router();
// cosnt verifyJwt = require('../middleware/verifyJwt');

router.put('/',verifyJwt, async (req, res) => {
  try {
    console.log("updateSports api called ");
    const { authorization } = req.headers;
    const { sports } = req.body;
    console.log("sports:", sports);
    
    // // Extract the token from the Authorization header
    // const token = authorization.split(' ')[1];

    // // Verify and decode the token
    // const decodedToken = jwt.verify(token, 'your-secret-key');

    // const userId = decodedToken.userId;

    const user = await User.findOneAndUpdate({_id:req?.userId},{"profile.sports":sports});
    // console.log("user:", user);

    // Find the user by userId
    // const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the sports array
    // user.profile.sports = sports;
    // await user.updateOne();

    res.status(200).json({ message: 'Sports updated successfully', user });
  } catch (error) {
    console.error('Error updating sports:', error);
    res.status(500).json({ error: 'An error occurred while updating sports' });
  }
});

module.exports = router;
