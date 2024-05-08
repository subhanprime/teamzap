const express = require('express')
const searchRouter = express.Router();
const catchAsync = require('../middleware/catchAsync.js')
const { handleSearch } = require("../controllers/search.controllers.js");

searchRouter.get('/:search', catchAsync(handleSearch));
module.exports = searchRouter;