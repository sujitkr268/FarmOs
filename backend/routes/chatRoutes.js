const express = require('express')
const router = express.Router()
const { processChatMessage } = require('../controllers/chatController')

// POST /api/chat
router.post('/', processChatMessage)

module.exports = router
