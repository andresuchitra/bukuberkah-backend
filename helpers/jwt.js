const jwt = require('jsonwebtoken')

module.exports = {
    sign: function(load) {
        return jwt.sign(load, process.env.SECRET)
    },
    verify: function(token) {
        try {
            return jwt.verify(token, process.env.SECRET)
        }
        catch(err) {
            return null
        }
    }
}