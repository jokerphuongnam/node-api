const noteEntities = require('../../database/domain/note')

const status = require('../../constants/statusConstants')
const parseJwt = require('../../utils/decode')
const response = require('../../database/domain/response')
const note = require('../../database/domain/note')

const getNotes = async (req, res) => {
    const userId = parseJwt(req.headers['authorization'].split(' ')[1]).user_id

    const searchWords = req.query.search_words

    let page = Number(req.query.page)
    if (!page) {
        page = 0
    } else if (page < 0) {
        return res.status(status.notfound).json(response(status.notfound, false, 'Page for pagination must >= 0'))
    }

    let limit = Number(req.query.limit)
    if (limit == undefined || limit == NaN) {
        limit = 5
    } else if (limit <= 0) {
        return res.status(status.notfound).json(response(status.notfound, false, 'Page at least have 1 item'))
    }

    let a = 0

    let notes = await noteEntities
        .find({ user_id: userId })
        .then(async (notes) => {
            if (searchWords) {
                let result = []
                for (i in notes) {
                    let note = notes[i]
                    if (note.title && note.title.includes(searchWords)) {
                        result.push(note._id)
                    }
                    if (note.description && note.description.includes(searchWords)) {
                        result.push(note._id)
                    }
                }
                return await noteEntities.find({
                    _id: {
                        $in: result
                    }
                })
                .limit(limit)
                .skip(limit * page)
                .sort({
                    update_at: 'descending'
                })
            } else {
                return await noteEntities
                    .find({ user_id: userId })
                    .limit(limit)
                    .skip(limit * page)
                    .sort({
                        update_at: 'descending'
                    })
            }
        })

    const lastPage = Math.ceil(await noteEntities.find({ user_id: userId }).countDocuments() / limit) - 1

    const hasNextPage = page == lastPage
    const hasPrePage = page == 0

    return res.status(status.success).json(response(
        status.success,
        true,
        'Get notes successfully',
        {
            notes,
            has_pre_page: hasPrePage,
            has_next_page: hasNextPage,
        }
    ))
}

module.exports = getNotes