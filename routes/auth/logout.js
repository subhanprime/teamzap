const express = require('express');
const router = express.Router();
const catchAsync = require('../../middleware/catchAsync.js');
const verifyJwt = require('../../middleware/verifyJwt.js');
const logoutHandler = require('../../controllers/authentication/logout.js');
// const authorizeRole = require('../../middleware/verifyRole.js');
// const ROLES = require('../../config/roles.js');
router.post('/', verifyJwt, catchAsync(logoutHandler));
module.exports = router;