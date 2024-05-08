const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { proofAddForProject } = require('../controllers/proofAddForProject.js');
const ROLES = require('../config/roles.js');
const upload = require('../helpers/multerConfig.js');
router.post('/', verifyJwt, authorizeRole(ROLES.CREATIVE), upload.array('files'), catchAsync(proofAddForProject));
module.exports = router