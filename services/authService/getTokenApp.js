const jwt = require('jsonwebtoken')

const response = require('../../database/domain/response')

const getAccessTokenApp = async (req, res) => {
    const config = process.env
    try {
        const authorization = req.body.token || req.headers['authorization']
        const token = authorization.split(' ')[1]
        if (!token) {
            return res.status(403).send('A token is required for authentication')
        }
        const decoded = jwt.verify(token, config.SECRET_KEY_JWT_LOGIN)

        const newtoken = await jwt.sign(
            { user_id: decoded.user_id, email: decoded.email },
            config.SECRET_KEY_JWT_APP,
            {
                expiresIn: '0.5h',
            }
        )
        return res.json(response(true, 'Get success access token', newtoken))
    } catch (err) {
        return res.status(401).send(response(false, 'Invalid Token'))
    }
}

module.exports = getAccessTokenApp