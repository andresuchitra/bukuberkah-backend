const chai      = require('chai'),
      chaiHttp  = require('chai-http'),
      expect    = chai.expect,
      app       = require('../app')
      clearUsers = require('../helpers/clearUsers');

chai.use(chaiHttp);
/* 
before(function(done) {
    clearUsers(done)
});

after(function(done) {
    clearUsers(done);
});
 */

describe('USER AUTH TEST', function() {
    let validRegister = {
        email: 'a@a.com',
        password: '1234'
    }

    let invalidRegister = {
        email: 'a@acom',
        password: '1234'
    }

    let incorrectPassword = {
        email: 'a@a.com',
        password: '12343'
    }

  describe('POST /auth/register', function() {
    it('should send the created user object with 201 status code', function(done) {
      chai
        .request(app)
        .post('/auth/register')
        .send(validRegister)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.equal(validRegister.email);
          expect(res.body).to.have.property('password');
          expect(res.body.password).to.not.equal(validRegister.password);
          done();
        });
    });

    it('should send a invalid email format message with 500 status code', function(done) {
        chai
          .request(app)
          .post('/auth/register')
          .send(invalidRegister)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(500);
            expect(res.body).to.be.a('string');
            expect(res.body).to.contains('format');
            done();
          });
      });

    it('should send email exist message with 500 status code', function(done) {
        chai
          .request(app)
          .post('/auth/register')
          .send(validRegister)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(500);
            expect(res.body).to.be.a('string');
            expect(res.body).to.contains('Email already in use');
            done();
          });
      });
  });

  describe('POST /auth/login', function() {
    it('should send an object containing token with 200 status code', function(done) {
      chai
        .request(app)
        .post('/auth/login')
        .send(validRegister)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('access_token');
          expect(res.body.access_token).to.be.not.null
          expect(res.body.access_token).to.be.not.equal(' ')
          done();
        });
    });

    it('should send user not existed with 401 status code', function(done) {
        chai
          .request(app)
          .post('/auth/login')
          .send(invalidRegister)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(401);
            expect(res.body).to.be.a('string');
            expect(res.body).to.contains('exist');
            done();
          });
      });

      it('should send incorrect password message with 401 status code', function(done) {
        chai
          .request(app)
          .post('/auth/login')
          .send(incorrectPassword)
          .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(401);
            expect(res.body).to.be.a('string');
            expect(res.body).to.contains('Incorrect password');

            done();
          });
      });
  });

});