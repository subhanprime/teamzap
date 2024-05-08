const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { updateBio } = require('../controllers/updateBio.js');
router.put('/', verifyJwt, catchAsync(updateBio));
module.exports = router