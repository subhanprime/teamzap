// routes/getOngoingProjects.js

const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/verifyJwt.js');
const catchAsync = require('../middleware/catchAsync.js');

const { getUser,specificUser } = require('../controllers/getUser.js');
router.get('/', verifyJwt, catchAsync(getUser));
router.get('/:userId', verifyJwt, catchAsync(specificUser));

module.exports = router;
