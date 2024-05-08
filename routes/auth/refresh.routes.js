// routes/login.js

const express = require("express");
const catchAsync = require('../../middleware/catchAsync.js');
const refreshControolers = require('../../controllers/refresh.controllers.js');

const router = express.Router();
router.get("/:refresh", catchAsync(refreshControolers));

module.exports = router;
