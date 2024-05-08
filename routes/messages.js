const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { createMessages,getMessages } = require('../controllers/messages.js');
router.post('/', verifyJwt, catchAsync(createMessages))
router.get('/', verifyJwt, catchAsync(getMessages))
module.exports = router