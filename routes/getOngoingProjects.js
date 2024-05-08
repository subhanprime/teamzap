// routes/getOngoingProjects.js

const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJwt.js');
const catchAsync = require('../middleware/catchAsync.js');

const { onGoingProject } = require('../controllers/onGoingProjects.js');
router.get('/', verifyJwt, catchAsync(onGoingProject));

module.exports = router;
