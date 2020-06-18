const chai = require('chai'),
    expect = chai.expect,
    chaiHttp = require('chai-http'),
    app = require('../app'),
    clearProducts = require('../helpers/clearProducts'),
    clearUsers = require('../helpers/clearUsers'),
    jwt = require('../helpers/jwt'),
    User = require('../models/user'),
    Product = require('../models/product')

chai.use(chaiHttp)
let token = '', anotherToken = ''
let validProductId
let oldProduct

before(function(done) {
    Product.deleteMany({}, () => { });
    User.deleteMany({}, () => { });

    oldProduct = {
        name: 'buku matematika',
        description: 'buku matematika ala sd now',
        price: 100000,
    }

    let acc = {
        email: 'a@a.com',
        password: '1234',
    }

    User.create(acc)
    .then(user => {
        token = jwt.sign({
            id: user._id,
            email: user.email
        });
    })
    .catch(err => {
        throw err
    })

   let acc2 = {
     email: 'b@b.com',
     password: '1234',
   }

   User.create(acc2)
    .then(user => {

    anotherToken = jwt.sign({
        id: user._id,
        email: user.email
     });
      
      done()
    })
    .catch(err => {
      throw err
    })

})

after(function(done) {
    clearProducts(done)
    clearUsers(done)
})

describe.only('Products', function () {
    describe('GET /products', function() {
        it('Should get status code 200 with object array (empty or with content)', function(done) {
            chai.request(app)
                .get('/products')
                .set('authorization', token)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        })

        it('Should get message to login first and status code 401', function(done) {
            chai.request(app)
                .get('/products')
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    expect(res.body).to.contains('login first');
                    done();
                });
        })
    });

    describe('POST /products', function() {
        it('Should send created product object with new ID', function(done){
            chai.request(app)
                .post('/products')
                .set('authorization', token)
                .send(oldProduct)
                .then(function(res) {
                    let newProduct = res.body
                    validProductId = newProduct._id
                    expect(res).to.have.status(201)
                    expect(newProduct).to.not.be.undefined
                    expect(newProduct).to.have.property('_id')
                    expect(newProduct).to.have.property('name')
                    expect(newProduct).to.have.property('price')
                    expect(newProduct.name).to.be.equal(oldProduct.name)
                    expect(newProduct.price).to.be.equal(oldProduct.price)

                    done()
                })
                .catch(function(err) {
                    console.log(`Add Product Test ======> ${err}`);
                })
        })

        it('Should get error required field message when missing product name', function(done){
            let product = {
                name: null,
                description: 'buku matematika ala sd now',
                price: 120000,
            }

            chai.request(app)
                .post('/products')
                .set('authorization', token)
                .send(product)
                .then(function(res) {
                    console.log(res.error.text);
                    expect(res).to.have.status(500)
                    done()
                })
                .catch(function(err) {
                    console.log(`Add Product Test ======> ${err}`);
                })
        })

        it('Should get error wrong data type message when creating non-numeric price value', function(done){
            let product = {
                name: 'buku matematika erlangga',
                description: 'buku matematika ala sd now',
                price: '121sdd',
            }

            chai.request(app)
                .post('/products')
                .set('authorization', token)
                .send(product)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res.body).to.contains('Cast to Number failed');
                    done();
                });
        })
    })

    describe('PUT /products', function() {
        it('Should send updated product object with new changes', function(done){
            let updateProduct = {
                name: 'Mobil anak',
                description: 'Mobil anak',
                price: 99999,
            }

            chai.request(app)
                .put('/products/'+id)
                .set('authorization', token)
                .send(updateProduct)
                .then(function(res) {
                    let newProduct = res.body

                    expect(res).to.have.status(200)
                    expect(newProduct).to.not.be.undefined
                    expect(newProduct).to.be.have.property('name')
                    expect(newProduct).to.be.have.property('price')
                    expect(newProduct).to.be.have.property('description')

                    expect(newProduct._id).to.be.equal(validProductId)
                    expect(newProduct.name).to.be.equal(updateProduct.name)
                    expect(newProduct.price).to.be.equal(updateProduct.price)
                    expect(newProduct.description).to.be.equal(updateProduct.description)

                    done()
                })
                .catch(function(err) {
                    console.log(`Update Product Test ======> ${err}`);
                })
        })
    })

    describe('DELETE /products/:id', function() {
        it('Should send deleted product information', function(done){

            chai.request(app)
                .delete('/products/'+id)
                .set('token', token)
                .then(function(res) {
                    let deleteProduct = res.body
                    expect(res).to.have.status(200)
                    expect(deleteProduct).to.not.be.undefined
                    expect(deleteProduct).to.have.property('_id')
                    expect(deleteProduct._id).to.be.equal(id)

                    return User.findOne({_id: id})
                })
                .then(function(found) {
                    expect(found).to.be.null
                    done()
                })
                .catch(function(err) {
                    console.log(`Delete Product Test ======> ${err}`);
                })
        })
    })
})