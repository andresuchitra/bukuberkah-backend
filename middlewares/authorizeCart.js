const Cart = require('../models/cart')

module.exports = function(req, res, next) {
    let id = req.params.id

    if(req.user.role === 'admin' || id === '0') {
        next()
    }
    else {
        Cart.findOne({_id: id})
            .then(cart => {
                if(cart) {
                    console.log(cart.user, req.user.id);
                    if(cart.user.toString() === req.user._id.toString()) {
                        next()
                    }
                    else {
                        res.status(403).json(`Forbidden to access the resource`)
                    }
                }
                else {
                    res.status(400).json(`Invalid ID`)
                }
            })
            .catch(err => {
                console.log('authorizeCart error ==> ',err);
                res.status(500).json(`Error during authorization. Please try again.`)
            })
        
    }
}