const route = require('express').Router()
const CartController = require('../controllers/cartController')
const authenticate = require('../middlewares/authenticate')
const authorizeCart = require('../middlewares/authorizeCart')

route.use('/', authenticate)

route.get('/', CartController.currentCart)
route.get('/transactions', CartController.userTransactions)
route.get('/:id', authorizeCart, CartController.findOne)

route.post('/:id', authorizeCart, CartController.purchase)
route.patch('/:id/confirm-receipt', authorizeCart, CartController.confirmDelivery)
route.patch('/:id', authorizeCart, CartController.addItem)
route.delete('/:id/delete/:itemId', authorizeCart, CartController.deleteItem)

module.exports = route