const express = require('express');
const router = express.Router();
const { createProjects, createSpecificProject } = require('../controllers/createProjects.controllers.js');
const upload = require('../helpers/multerConfig.js');
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const ROLES = require('../config/roles.js');

router.post('/create', verifyJwt, authorizeRole(ROLES.ATHLETE), upload.fields([{ name: 'inspiration', maxCount: 10 }, { name: 'files', maxCount: 10 }]), catchAsync(createProjects));
router.post('/create/specific', verifyJwt, authorizeRole(ROLES.ATHLETE), upload.fields([{ name: 'inspiration', maxCount: 10 }, { name: 'files', maxCount: 10 }]),catchAsync(createSpecificProject));
module.exports = router;
