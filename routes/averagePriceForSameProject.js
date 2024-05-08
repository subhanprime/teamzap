const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const {averagePriceForSameProject,userAveragePriceForSameProject} = require('../controllers/averagePriceForSameProject.js');
const ROLES = require('../config/roles.js');
router.get('/', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(averagePriceForSameProject));
router.get('/user', verifyJwt, authorizeRole(ROLES.CREATIVE), catchAsync(userAveragePriceForSameProject));
module.exports = router