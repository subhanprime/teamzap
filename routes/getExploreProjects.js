const express = require('express');
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { exploreProjects } = require('../controllers/getExploreProjects.controllers.js');
const router = express.Router();
router.get('/explore', verifyJwt, catchAsync(exploreProjects));
module.exports = router;
