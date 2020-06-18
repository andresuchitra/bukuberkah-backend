const Product = require('../models/product')

module.exports = function(done) {
        if(process.env.NODE_ENV === 'test') {
            Product
                .deleteMany({})
                .then(function() {
                    done()
                })
                .catch(function(err) {
                    console.log(`Error Clearing Products: ${err}`)
                })
        }
}