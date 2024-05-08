const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { allProjectsOfAthlete } = require('../controllers/allAthleteProjects.js');
const ROLES = require('../config/roles.js');
router.get('/', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(allProjectsOfAthlete));
module.exports = router