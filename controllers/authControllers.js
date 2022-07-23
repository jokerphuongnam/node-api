const express = require('express')
const router = express.Router()
const authService = require('../services/authService')
const middleware = require('../middleware/middleware')

router.post("/login", middleware.rateLimiterMiddlewareUnauthorized, async (req, res) => {
    return await authService.login(req, res)
})

router.post("/register", middleware.rateLimiterMiddlewareUnauthorized, async (req, res) => {
    return await authService.register(req, res)
})

router.get('/get-access-token', middleware.verifyTokenLogin, async (req, res) => {
    return await authService.getAccessTokenApp(req, res)
})

module.exports = router