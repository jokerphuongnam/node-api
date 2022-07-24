const noteEntities = require('../../database/domain/note')

const status = require('../../constants/statusConstants')
const response = require('../../database/domain/response')

const deleteNote = async (req, res) => {
    const { id } = req.params
    if (id) {
        try {
            const note = await noteEntities.findOne({ _id: id })
            await note.remove()
            return res.status(status.created).json(response(status.created, true, 'Delete note successfully', note))
        } catch (error) {
            console.log(error)
            return res.status(status.bad_request).json(response(status.bad_request, false, 'Delete note fail', error.message))
        }
    } else {
        return res.status(status.bad_request).json(response(status.bad_request, false, 'Need id of note'))
    }
}

module.exports = deleteNote