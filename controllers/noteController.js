const express = require('express')
const router = express.Router()
const notesService = require('../services/notesService')
const middleware = require('../middleware/middleware')

router.get('/', middleware.verifyTokenApp, async (req, res) => {
    return await notesService.getNotes(req, res)
});

router.post('/insert-note', [middleware.verifyTokenApp, middleware.rateLimiterMiddleware], async (req, res) => {
    return await notesService.insertNote(req, res)
})

router.put('/update-note', [middleware.verifyTokenApp, middleware.rateLimiterMiddleware], async (req, res)=> {
    return await notesService.updateNote(req, res)
})

module.exports = router