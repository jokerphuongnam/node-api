const jwt = require('jsonwebtoken')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const parseJwt = require('../utils/decode')
const response = require('../database/domain/response')
const config = process.env

const rateLimiter = new RateLimiterMemory({
    points: 1,
    duration: 5,
})
const rateLimiterUnauthorized = new RateLimiterMemory({
    points: 1,
    duration: 5,
})

const middleware = {
    rateLimiterMiddlewareUnauthorized: (req, res, next) => {
        rateLimiterUnauthorized.consume(req.ip) // or req.ip
            .then(() => {
                next()
            })
            .catch((rejRes) => {
                res.status(429).send(response(429, false, 'Too Many Requests'))
            })
    },
    rateLimiterMiddleware: (req, res, next) => {
        const userId = parseJwt(req.headers['authorization'].split(' ')[1]).user_id
        rateLimiter.consume(userId) // or req.ip
            .then(() => {
                next()
            })
            .catch((rejRes) => {
                res.status(429).send(response(429, false, 'Too Many Requests'))
            })
    },
    verifyTokenLogin: (req, res, next) => {
        try {
            const authorization = req.body.token || req.headers['authorization']
            const token = authorization.split(' ')[1]
            if (!token) {
                return res.status(403).send('A token is required for authentication')
            }
            const decoded = jwt.verify(token, config.SECRET_KEY_JWT_LOGIN)
            req.user = decoded
        } catch (err) {
            return res.status(401).send(response(401, false, 'Invalid Token'))
        }
        return next()
    },
    verifyTokenApp: (req, res, next) => {
        try {
            const authorization = req.body.token || req.headers['authorization']
            const token = authorization.split(' ')[1]
            if (!token) {
                return res.status(403).send('A token is required for authentication')
            }
            const decoded = jwt.verify(token, config.SECRET_KEY_JWT_APP)
        } catch (err) {
            return res.status(401).send(response(401, false, 'Invalid Token'))
        }
        return next()
    }
}

module.exports = middleware