const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { deleteProjects, specificCompleted } = require('../controllers/projects.js');
const ROLES = require('../config/roles.js');

router.delete('/delete/:projectId', verifyJwt, authorizeRole(ROLES.ATHLETE), catchAsync(deleteProjects));
router.get('/completed', verifyJwt, authorizeRole(ROLES.CREATIVE), catchAsync(specificCompleted));
module.exports = router;