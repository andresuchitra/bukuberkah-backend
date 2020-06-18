const Product = require('../models/product')
const Comment = require('../models/comment')

class ProductController {
    static findAll(req, res) {
        Product.find()
            .then(list => {
                res.status(200).json(list)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }
    static findOne(req, res) {
        Product.findOne({_id: req.params.id})
            .populate({path: 'comments', populate: {path: 'author', model: 'User'}})
            .then(product => {
                if(!product.comments) {
                    product.comments = []
                }
                res.status(200).json(product)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }
    static create(req, res) {
        console.log(req.body);

        let product = {}

        for(let key of Object.keys(req.body)) {
            if(key !== '_id') {
                product[key] = req.body[key]
            }
        }

        if(req.file) {
            product.image = req.file.location
        }
        else {
            product.image = process.env.USER_DEFAULT
        }

        Product.create(product)
            .then(newProd => {
                res.status(201).json(newProd)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }
    static delete(req, res) {
        Product.findOneAndDelete({_id: req.params.id})
            .then(deleted => {
                res.status(200).json(deleted)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }
    static update(req, res) {
        if(req.file) {
            req.body.image = req.file.location
        }
        Product.update({_id: req.params.id}, req.body, {new: true})
            .then(product => {
                res.status(200).json(product)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }
    static search(req, res) {
        let findRegex = new RegExp(req.params.key, "i");

        Product.find({ $or:[ {name: findRegex}, {description : findRegex} ]})
            .then(results => {
                res.status(200).json(results)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err.message)
            })
    }
    static addComment(req, res) {
        let productId = req.params.id
        
        Product.findOne({_id: productId})
            .then(product => {
                if(!product) {
                    res.status(404).json('Invalid Product')
                }
                else {
                    req.body.author = req.user._id
                    Comment.create({...req.body})
                        .then(comment => {
                            if(!product.comments) {
                                product.comments = []
                            }

                            Product.findOneAndUpdate({_id: productId}, {$push: {comments: comment._id}}, {new: true})
                                .populate({path: 'comments', populate: {path: 'author', model: 'User'}})
                                .then(newProduct => {
                                    console.log(newProduct);
                                    res.status(201).json(newProduct)
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
                console.log(err);
                res.status(500).json(err.message)
            })
    }
    static deleteComment(req, res) {
        Comment.findOneAndDelete({_id: req.params.commentId})
            .then(comment => {
                Product.findOneAndUpdate({_id: req.params.id}, {comments: {$pull: req.params.commentId}}, {new: true})
                    .then(updated => {
                        res.status(200).json(updated)
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
}
module.exports = ProductController