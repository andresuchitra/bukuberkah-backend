const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    content: String,
    created_at: {
        type: Date,
        default: new Date()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment