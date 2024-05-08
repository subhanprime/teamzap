const express = require('express');
const router = express.Router();
const { favoriteList } = require('../controllers/athleteFavoriteList.js');

const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');

router.post('/', verifyJwt, catchAsync(favoriteList));
module.exports = router;
