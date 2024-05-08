// routes/getPendingProjects.js

const express = require("express");
const router = express.Router();
const verifyJwt = require("../middleware/verifyJwt.js");
const catchAsync = require("../middleware/catchAsync.js");
const { pendingProjects } = require('../controllers/pendingProjects.js');
router.get("/", verifyJwt, catchAsync(pendingProjects));

module.exports = router;
