const userEntities = require('../../database/domain/user')

const status = require('../../constants/statusConstants')
const bcrypt = require('bcryptjs')
const response = require('../../database/domain/response')
const parseJwt = require('../../utils/decode')

const changePassword = async (req, res) => {
    const oldPassword = req.body.old_password
    const newPassword = req.body.new_password

    const userId = parseJwt(req.headers['authorization'].split(' ')[1]).user_id
    try {
        if (!oldPassword || !newPassword) {
            return res.status(status.bad_request).json(response(status.bad_request, false, 'Need old password and new password'))
        }
        let user = await userEntities.findById(userId)
        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            
            const encryptedPassword = await bcrypt.hash(newPassword, 10)
        
            await userEntities.updateOne({ user_id: userId }, { password: encryptedPassword })
            user = await userEntities.findById(userId)
            const userClone = { ...user._doc }
            delete userClone.password
            return res.status(status.created).json(response(status.created, true, 'Update profile successfully', userClone))
        } else {
            return res.status(status.unauthorized).json(response(status.unauthorized, false, 'Invalid Credentials'))
        }
    } catch (error) {
        return res.status(status.bad_request).json(response(status.bad_request, false, 'Update profile fail', error.message))
    }
}

module.exports = changePassword