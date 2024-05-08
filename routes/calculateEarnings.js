const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { earningProjectWise } = require('../controllers/calculateEarning.js');
const ROLES = require('../config/roles.js');
router.get('/creative', verifyJwt, authorizeRole(ROLES.CREATIVE), catchAsync(earningProjectWise));
module.exports = router