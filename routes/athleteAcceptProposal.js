const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { athleteAcceptProposalOfCreative } = require('../controllers/athleteAcceptProposal.js');
const ROLES = require('../config/roles.js');
router.post('/', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(athleteAcceptProposalOfCreative));
module.exports = router