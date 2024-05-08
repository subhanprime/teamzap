const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { acceptProject } = require('../controllers/acceptRejectProject.js');
router.put('/:projectId', verifyJwt, catchAsync(acceptProject))
module.exports =router