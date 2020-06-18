const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Cart must have related user']
    },
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total value must be 0 or more']
    },
    items: [{type: Schema.Types.ObjectId, ref: 'CartItem'}],
    status: {
        type: String,
        default: 'open',
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    payment_date: {
        type: Date,
    },
})

/* cartSchema.pre('save', function(next) {
    let amt = 0
    console.log('before calculat total..',this);
    this.items.forEach(x => {
        mongoose.models['CartItem'].findOne({_id: x})
            .then(cartItem => {
                amt += cartItem.price;
            })
            .catch(err => {
                throw Error(err)
            })
    });
    console.log('after calculat total..',this);
}) */

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart