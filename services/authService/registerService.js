const userEntities = require('../../database/domain/user')
const bcrypt = require('bcryptjs')
const status = require('../../constants/statusConstants')
const respone = require('../../database/domain/response')

const register = async (req, res) => {
    const { email, password } = req.body
    if (!(email && password)) {
        return res.status(status.bad_request).send(respone(false, 'All input is required'))
    }

    const oldUser = await userEntities.findOne({ email: email.toLowerCase() })
    if (oldUser) {
        return res.status(status.conflict).send(respone(false, 'User Already Exist!'))
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
        return res.status(status.created).json(respone(status.created, true, 'Create Account successfuly', userClone))
    } catch (error) {
        return res.status(status.conflict).json(respone(status.conflict, false, 'Create Account Failed'))
    }
}

module.exports = register