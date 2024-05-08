const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const { userRelativeCreative } = require('../controllers/relativeCreative.js');
const verifyJwt = require('../middleware/verifyJwt.js');
router.get('/', verifyJwt, catchAsync(userRelativeCreative));
module.exports = router;