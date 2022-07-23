const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String
    },
    name: {
        type: String,
        require: true,
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Secret'],
        require: true,
        default: 'Secret'
    },
    note_ids: [
        {
            type: Schema.Types.ObjectId,
            ref: 'notes'
        }
    ]
})

module.exports = mongoose.model("users", userSchema)