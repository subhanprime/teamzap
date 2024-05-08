const express = require("express");
const router = express.Router();
const catchAsync = require('../../middleware/catchAsync.js');
const handleRegister = require('../../controllers/authentication/register.controllers.js');
const upload = require('../../helpers/multerConfig.js');

router.post("/", upload.single('file'), catchAsync(handleRegister));

module.exports = router;
