const User = require('../models/user')

module.exports = function(done) {
        User
            .deleteMany({})
            .then(function() {
                done()
            })
            .catch(function(err) {
                console.log(`Error Clearing Users: ${err}`)
            })
}