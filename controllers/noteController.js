const express = require('express')
const router = express.Router()
const notesService = require('../services/notesService')
const middleware = require('../middleware/middleware')

router.post("/insert-note", [middleware.verifyTokenApp, middleware.rateLimiterMiddleware], async (req, res) => {
    return await notesService.insertNote(req, res)
})

module.exports = router