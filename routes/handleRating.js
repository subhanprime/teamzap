const express = require('express');
const router = express.Router();

const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');

const { handleRating, userRatings, userRatingsStars, addAthleteReview } = require('../controllers/handleRating.js');
const ROLES = require('../config/roles.js');

router.post('/add/athlete', verifyJwt, authorizeRole(ROLES.CREATIVE), catchAsync(addAthleteReview));
router.post('/add', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(handleRating));
router.get('/:creativeId', verifyJwt, catchAsync(userRatings));
router.get('/stars/:creativeId', verifyJwt, catchAsync(userRatingsStars));

module.exports = router