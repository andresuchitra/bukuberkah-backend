const route = require('express').Router()
const ProductController = require('../controllers/productsController')
const authenticate = require('../middlewares/authenticate')
const authorizeProduct = require('../middlewares/authorizeProduct')
const authorizeComment = require('../middlewares/authorizeComment')
const multer = require('../helpers/aws-s3')

route.get('/', ProductController.findAll)
route.get('/search/:key', ProductController.search)
route.get('/:id', ProductController.findOne)

route.use('/', authenticate)

route.patch('/:id/addComment', ProductController.addComment)
route.patch('/:id/deleteComment/:commentId', authorizeComment, ProductController.deleteComment)
route.post('/', multer.single('image'),  ProductController.create)
route.put('/:id', authorizeProduct, ProductController.update)
route.patch('/:id', authorizeProduct, ProductController.update)
route.put('/:id/pic', authorizeProduct, multer.single('image'), ProductController.update)
route.patch('/:id/pic', authorizeProduct, multer.single('image'), ProductController.update)
route.delete('/:id', authorizeProduct, ProductController.delete)

module.exports = route