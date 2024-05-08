// routes/getProject.js

const express = require('express');
const router = express.Router();
const verifyJwt = require("../middleware/verifyJwt.js");
const catchAsync = require('../middleware/catchAsync.js');
const { getProjects } = require('../controllers/getProjects.js');
router.get('/:projectId', verifyJwt, catchAsync(getProjects));
module.exports = router;
