const userEntities = require('../../database/domain/user')

const status = require('../../constants/statusConstants')
const response = require('../../database/domain/response')
const parseJwt = require('../../utils/decode')

const updateProfile = async (req, res) => {
    const { name, gender } = req.body

    const userId = parseJwt(req.headers['authorization'].split(' ')[1]).user_id
    try {
        let query = {}
        if (name) {
            query.name = name
        }
        if (gender) {
            query.gender = gender
        }
        await userEntities.updateOne({user_id: userId}, query)
        const user = await userEntities.findOne({ user_id: userId })
        const userClone = { ...user._doc }
        delete userClone.password
        return res.status(status.created).json(response(status.created, true, 'Update profile successfully', userClone))
    } catch (error) {
        return res.status(status.bad_request).json(response(status.bad_request, false, 'Update profile fail', error.message))
    }
}

module.exports = updateProfile