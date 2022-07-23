const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        require: false
    },
    description: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true,
        default: '#FBF048'
    },
    create_at: {
        type: Number,
        require: true
    },
    update_at: {
        type: Number,
        require: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model("notes", noteSchema)