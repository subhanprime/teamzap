// routes/getProject.js

const express = require('express');
const router = express.Router();
const verifyJwt = require("../middleware/verifyJwt.js");
const catchAsync = require('../middleware/catchAsync.js');
const { updateUser } = require('../controllers/handleUser.js');
const upload = require('../helpers/multerConfig.js');
// upload.single('file'),
router.put('/update', verifyJwt, upload.fields([{ name: 'avatar' }, { name: 'files', maxCount: 10 }]), catchAsync(updateUser));
module.exports = router;
