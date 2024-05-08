const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { accountVerify } = require('../controllers/accountVerify.js');
// const ROLES = require('../config/roles.js');
// verifyJwt, authorizeRole(ROLES.ATHLETE),
router.get('/', catchAsync(accountVerify));
module.exports = router