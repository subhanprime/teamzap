const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { pendingProjects } = require('../controllers/creativeProjectStatus.js');
router.get('/', verifyJwt, catchAsync(pendingProjects))
module.exports = router