const express = require('express');
const router = express.Router();
const catchAsync = require('../middleware/catchAsync.js');
const verifyJwt = require('../middleware/verifyJwt.js');
const { createConversation, getConversation } = require('../controllers/conversations.js');
router.post('/', verifyJwt, catchAsync(createConversation))
router.get('/', verifyJwt, catchAsync(getConversation))
module.exports = router