const express = require('express');
const router = express.Router();
const { searchCreative } = require('../controllers/searchCreatives.js');

const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');

router.get('/:search', verifyJwt, catchAsync(searchCreative));
module.exports = router;
