// routes/login.js

const express = require("express");
const catchAsync = require('../../middleware/catchAsync.js');
const loginHandler = require('../../controllers/authentication/login.controllers.js')
const router = express.Router();

router.post("/", catchAsync(loginHandler));

module.exports = router;
