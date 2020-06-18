const crypt = require('bcryptjs')

module.exports = {
    hashPassword: function(pwd) {
        return crypt.hashSync(pwd, crypt.genSaltSync(7))
    },
    comparePassword: function(pwd, hash) {
        return crypt.compareSync(pwd, hash)
    }
}