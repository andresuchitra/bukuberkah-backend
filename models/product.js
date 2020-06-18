const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: String,
    stock: {
        type: Number,
        default: 0,
    },
    price: { 
        type: Number,
        default: 0,
    },
    image: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product