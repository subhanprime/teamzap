const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { submitProposal, acceptProposalOfCreative, rejectProposalOfCreative } = require('../controllers/proposal.js');

const authorizeRole = require('../middleware/verifyRole.js');
const ROLES = require('../config/roles.js');

router.get('/accept-of-creative/:proposalId', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(acceptProposalOfCreative));
router.get('/reject-of-creative/:proposalId', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(acceptProposalOfCreative));

router.post('/send', verifyJwt, catchAsync(submitProposal));
module.exports = router