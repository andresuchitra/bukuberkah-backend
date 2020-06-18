const Cart = require('../models/cart')
const CartItem = require('../models/cartItem')
const Product = require('../models/product')

class CartController {
    static currentCart(req, res) {
        Cart.findOne({
                user: req.user._id,
                status: 'open'
            })
            .populate('user')
            .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
            .then(cart => {
                res.status(200).json(cart)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }
    static findAll(req, res) {
        Cart.find()
            .populate('user')
            .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
            .then(carts => {
                res.status(200).json(carts)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }

    static findOne(req, res) {
        Cart.findOne({
                _id: req.params.id
            })
            .populate('user')
            .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
            .then(cart => {
                res.status(200).json(cart)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static addItem(req, res) {
        let cartItem, newCart, cartId
        cartId = req.params.id

        let item = req.body;

        //dummy cart for first time cart by client
        if (cartId === '0') {
            Cart.create({
                user: req.user._id,
                totalAmount: item.price
            })
            .then( (cart) => {
                newCart = cart
                cartId = cart._id

                CartItem.create({
                    product: item._id,
                    quantity: item.quantity,
                    price: item.price
                })
                .then(cartItem => {
                    Cart.findOneAndUpdate(
                        {
                            _id: newCart._id
                        },
                        {
                            $push: {items: cartItem._id},
                            $inc: {totalAmount: cartItem.price}
                        },
                        {
                            new: true,
                        }
                    )
                    .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
                    .then(updated => {
                        res.status(201).json(updated);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json(err.message)
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err.message)
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
        } else {
            Cart.findOne({
                    _id: cartId,
                    status: 'open'
                })
                .populate('user')
                .then(cart => {
                    if(cart) { //if there is open cart, add item to it
                        CartItem.create({
                            product: item._id,
                            quantity: item.quantity,
                            price: item.price
                        })
                        .then(cartItem => {
                            Cart.findOneAndUpdate(
                                {
                                    _id: cartId
                                },
                                {
                                    $push: {items: cartItem._id},
                                    $inc: {totalAmount: cartItem.price}
                                },
                                {
                                    new: true,
                                }
                            )
                            .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
                            .then(updated => {
                                res.status(201).json(updated);
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json(err.message)
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(err.message)
                        })
                    }
                    else { //if no open cart existed, create new one
                        Cart.create({
                            user: req.user._id,
                            items: [item._id],
                            totalAmount: item.price
                        })
                        .then(function (cart) {
                            newCart = cart
                            CartItem.create({
                                product: item._id,
                                quantity: item.quantity,
                                price: item.price
                            })
                            .then(cartItem => {
                                Cart.findOneAndUpdate(
                                    {
                                        _id: newCart._id
                                    },
                                    {
                                        $push: {items: cartItem._id},
                                        $inc: {totalAmount: cartItem.price}
                                    },
                                    {
                                        new: true,
                                    }
                                )
                                .populate({path: 'items', populate: {path: 'product', model: 'Product'}})
                                .then(updated => {
                                    res.status(201).json(updated);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json(err.message)
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json(err.message)
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(err.message)
                        })
                    }
                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    }
    static deleteItem(req, res) {
        let cartId = req.params.id
        let itemId = req.params.itemId

        CartItem.findOne({_id: itemId})
            .then(cartItem => {
                Cart.findOneAndUpdate({
                    _id: cartId,
                    status: 'open'
                }, {
                    $pull: {
                        items: itemId
                    },
                    $inc: {totalAmount: Number(cartItem.price)* -1}
                }, {
                    new: true
                })
                .then(cart => {
                    if (cart) {
                        res.status(200).json(cart)
                    } else {
                        res.status(400).json('Invalid Cart')
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err.message)
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }

    static purchase(req, res) {
        let promises = [];

        Cart.findOne({_id: req.params.id})
            .populate('items')
            .then(cart => {
                cart.items.forEach(x => {
                    promises.push(Product.findOneAndUpdate({_id: x.product}, {$inc: {stock: x.quantity * -1}}, {new: true}));
                })

                Promise.all(promises)
                    .then(results => {
                        Cart.findOneAndUpdate({
                            _id: req.params.id
                        }, {
                            status: 'paid'
                        }, {
                            new: true
                        })
                        .then(cart => {
                            res.status(200).json(cart)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(err.message)
                        })
                    })
                    .catch(err => {
                        res.status(500).json(err.message);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }

    static confirmDelivery(req, res) {
        Cart.findOneAndUpdate({
            _id: req.params.id
        }, {
            status: 'received'
        }, {
            new: true
        })
        .then(cart => {
                res.status(200).json(cart)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }

    static userTransactions(req, res) {
        Cart.find({user: req.user._id, })
            .then(list => {
                if(!list) {
                    list = [];
                }
                res.status(200).json(list)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }
}

module.exports = CartController