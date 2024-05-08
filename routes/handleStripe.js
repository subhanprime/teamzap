const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');

const { chargeStripe, sendAmountToBankAccount, showStripe } = require('../controllers/handleStripe.js');
const authorizeRole = require('../middleware/verifyRole.js');
const ROLES = require('../config/roles.js');

router.post('/charge', verifyJwt, catchAsync(chargeStripe));
router.post('/send-amount', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(sendAmountToBankAccount));
router.post('/add-account', verifyJwt, authorizeRole(ROLES.CREATIVE), catchAsync(showStripe));

module.exports = router;