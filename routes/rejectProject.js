const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { rejectProject } = require('../controllers/acceptRejectProject.js');
router.put('/:projectId', verifyJwt, catchAsync(rejectProject));
module.exports = router