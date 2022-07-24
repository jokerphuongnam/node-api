const userEntities = require('../../database/domain/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const response = require('../../database/domain/response')
const status = require('../../constants/statusConstants')

module.exports = loginService = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            return res.status(400).json(response(false, 'All input is required'))
        }
        const user = await userEntities.findOne({ email: email.toLowerCase() })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = await jwt.sign(
                { user_id: user._id, email },
                process.env.SECRET_KEY_JWT_LOGIN,
                {
                    expiresIn: '7d',
                }
            )

            user.token = token
            return res.status(status.success).json(response(status.success, true, 'Login successfully', user))
        }
        return res.status(status.unauthorized).json(response(status.unauthorized, false, 'Invalid Credentials'))
    } catch (err) {
        return res.status(status.unauthorized).json(response(status.unauthorized, false, err))
    }
}