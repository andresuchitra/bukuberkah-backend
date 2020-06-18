const jwt = require('../helpers/jwt')
const User = require('../models/user')

module.exports = function(req, res, next) {
    if(req.headers.authorization) {
        let payload, email
        try {
            payload = jwt.verify(req.headers.authorization)
            email = payload.email
            
            User.findOne({email: email})
            .then(user => {
                if(user) {
                    req.user = user
                    next()
                }
                else {
                    res.status(401).json(`Invalid email`)
                }
            })
            .catch(error => {
                res.status(500).json(`Error authenticate user`)
            })
        }
        catch(error) {
            console.log(error);
            res.status(500).json(`Please try again or LOGIN first!`)
        }
    }
    else {
        res.status(401).json(`Please login first`)
    }
}