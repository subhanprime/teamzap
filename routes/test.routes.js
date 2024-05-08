const { testHandlers } = require("../controllers/test.controller.js");
const express = require('express');
const catchAsync = require('../middleware/catchAsync.js')
const testRouter = express.Router();

testRouter.get('/', catchAsync(testHandlers));
module.exports = testRouter;