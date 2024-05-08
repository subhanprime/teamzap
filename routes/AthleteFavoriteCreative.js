const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const { athleteFavoriteCreative } = require('../controllers/athleteFavouriteCreative.js');

const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const ROLES = require('../config/roles.js');

// verifyJwt, authorizeRole(ROLES.ATHLETE),
router.get('/favorite-creative',verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(athleteFavoriteCreative));
module.exports = router