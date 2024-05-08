const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const authorizeRole = require('../middleware/verifyRole.js');
const { uploadFinalProject } = require('../controllers/uploadFinalProject.js');
const ROLES = require('../config/roles.js');
const upload = require('../helpers/multerConfig.js');

router.post('/', verifyJwt, authorizeRole(ROLES.CREATIVE), upload.single('zipFile'), catchAsync(uploadFinalProject));
module.exports = router