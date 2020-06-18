const route = require('express').Router()
const product = require('./products')
const auth = require('./auth')
const cart = require('./cart')
const CartController = require('../controllers/cartController')
const authenticate = require('../middlewares/authenticate')
const authorizeCart = require('../middlewares/authorizeCart')

route.use('/products', product)
route.use('/auth', auth)
route.use('/cart', cart)
route.get('/transactions', authenticate, authorizeCart, CartController.findAll)

module.exports = route