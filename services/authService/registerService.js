const userEntities = require('../../database/domain/user')
const bcrypt = require('bcryptjs')
const status = require('../../constants/statusConstants')
const response = require('../../database/domain/response')

const register = async (req, res) => {
    const { email, password } = req.body
    if (!(email && password)) {
        return res.status(status.bad_request).send(response(false, 'All input is required'))
    }

    const oldUser = await userEntities.findOne({ email: email.toLowerCase() })
    if (oldUser) {
        return res.status(status.conflict).send(response(false, 'User Already Exist!'))
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await new userEntities({
            name: 'User',
            gender: 'Secret',
            email: email.toLowerCase(),
            password: encryptedPassword
        })
        await user.save()
        const userClone = { ...user._doc }
        delete userClone.password
        return res.status(status.created).json(response(status.created, true, 'Create Account successfully', userClone))
    } catch (error) {
        return res.status(status.conflict).json(response(status.conflict, false, 'Create Account Failed'))
    }
}

module.exports = register