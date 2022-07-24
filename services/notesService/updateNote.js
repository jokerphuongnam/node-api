const mongoose = require('mongoose')

const noteEntities = require('../../database/domain/note')

const status = require('../../constants/statusConstants')
const response = require('../../database/domain/response')

const updateNote = async (req, res) => {
    const { id, title, description, color } = req.body

    if (id) {
        try {
            let noteUpdate = {
                update_at: new Date().getTime()
            }

            let note = await noteEntities.findById(id)

            if (title === "" && description == "") {
                return res.status(status.bad_request).json(response(status.bad_request, false, 'Need title or description of note'))
            }

            if (title === "") {
                note.set('title', undefined, { strict: false })
                note.save()
            }
            else if (title) {
                noteUpdate.title = title
            }
            if (description === "") {
                note.set('description', undefined, { strict: false })
                note.save()
            } else if (description) {
                noteUpdate.description = description
            }
            if (color) {
                noteUpdate.color = color
            }
            await noteEntities.updateOne({ _id: id }, noteUpdate)
            return res.status(status.created).json(response(status.created, true, 'Update note successfully', await noteEntities.findById(id)))
        } catch (error) {
            return res.status(status.notfound).json(response(status.notfound, false, 'Update note fail', error.message))
        }
    } else {
        return res.status(status.bad_request).json(response(status.bad_request, false, 'Need id of note'))
    }
}

module.exports = updateNote