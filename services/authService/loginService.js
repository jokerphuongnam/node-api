const userEntities = require('../../database/domain/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const respone = require('../../database/domain/response')
const status = require('../../constants/statusConstants')

module.exports = loginService = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            return res.status(400).json(respone(false, "All input is required"))
        }
        const user = await userEntities.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = await jwt.sign(
                { user_id: user._id, email },
                process.env.SECRET_KEY_JWT_LOGIN,
                {
                    expiresIn: "7d",
                }
            );

            user.token = token
            return res.status(status.success).json(respone(status.success, true, 'Login successfuly', user))
        }
        return res.status(status.unauthorized).json(respone(status.unauthorized, false, "Invalid Credentials"))
    } catch (err) {
        console.log(err);
        return res.status(status.unauthorized).json(respone(status.unauthorized, false, err))
    }
}