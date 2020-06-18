const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId, 
        ref: 'Product'
    },
    quantity: {
        type: Number,
        min: [0,`Quantity can't be negative`]
    },
    price: {
        type: Number,
        default: 0,
        min: [0, `Price can't be negative`]
    }
})


const CartItem = mongoose.model('CartItem', cartItemSchema)

module.exports = CartItem