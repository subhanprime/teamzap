const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const { forgotPassword, resetPassword } = require('../controllers/forgotPassword.js');
// const verifyJwt = require('../middleware/verifyJwt.js');
// const authorizeRole = require('../middleware/verifyRole.js');
// const ROLES = require('../config/roles.js');
router.post('/forgot', catchAsync(forgotPassword));
router.put('/reset', catchAsync(resetPassword));
module.exports = router