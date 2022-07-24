const noteEntities = require('../../database/domain/note')

const status = require('../../constants/statusConstants')
const parseJwt = require('../../utils/decode')
const response = require('../../database/domain/response')

const insertNote = async (req, res) => {
    const { title, description, color } = req.body

    const userId = parseJwt(req.headers['authorization'].split(' ')[1]).user_id
    try {
        const time = new Date().getTime()
        const note = new noteEntities({
            title,
            description,
            color: color || '#FBF048',
            create_at: time,
            update_at: time,
            user_id: userId
        })
        await note.save()
        return res.status(status.created).json(response(status.created, true, 'Create note successfully', note))
    } catch (error) {
        return res.status(status.bad_request).json(response(status.bad_request, false, 'Create note fail', error.message))
    }
}

module.exports = insertNote