const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { inProgressProjects } = require('../controllers/creativeProjectStatus.js');
router.get('/', verifyJwt, catchAsync(inProgressProjects))
module.exports = router