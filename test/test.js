const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('Node-Task', function() {
    it('it should return JWT token', (done) => {
    chai.request(server)
      .post('/login')
      .send({user_email: "xyz@gmail.com", user_password: "12345"})
      .end((err, res) => {
            (res).should.have.status(200);
            (res.body).should.be.a('object');
            (res.body.data.authToken).should.be.a('string');
            done();
         });
    });

    it('it should return pactched JSON object', (done) => {
        chai.request(server)
            .post('/login')
            .send({user_email: "xyz@gmail.com", user_password: "12345"})
            .end((err, res) => {
                chai.request(server)
                .post('/jsonPatch')
                .set('x-auth-token', res.body.data.authToken)
                .send({json: '{"baz": "qux","foo": "bar"}', patch: '[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello", "value": ["world"] },{ "op": "remove", "path": "/foo" }]'})
                .end((error, response) => {
                      (response).should.have.status(200);
                      (response.body).should.be.a('object');
                      (response.body.result).should.be.a('object');
                      (response.body.result.baz).should.equal('boo');
                      (response.body.result.hello[0]).should.equal('world');
                      done();
                });
            });
    });

    it('it should return resized image', (done) => {
        chai.request(server)
            .post('/login')
            .send({user_email: "xyz@gmail.com", user_password: "12345"})
            .end((err, res) => {
                chai.request(server)
                .post('/thumbnail')
                .set('x-auth-token', res.body.data.authToken)
                .send({imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png"})
                .end((error, response) => {
                      (response).should.have.status(200);
                      done();
                });
            });
    });

    it('it should not return pactched JSON object', (done) => {
        chai.request(server)
        .post('/jsonPatch')
        .send({json: '{"baz": "qux","foo": "bar"}', patch: '[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello", "value": ["world"] },{ "op": "remove", "path": "/foo" }]'})
        .end((error, response) => {
              (response).should.have.status(401);
              (response.body).should.be.a('object');
              (response.body.msg).should.equal("Access denied");
              done();
        });
    });

    it('it should not return resized image', (done) => {
        chai.request(server)
        .post('/thumbnail')
        .send({imgUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png"})
        .end((error, response) => {
              (response).should.have.status(401);
              (response.body).should.be.a('object');
              (response.body.msg).should.equal("Access denied");
              done();
        });
    });

    it('it should not return JWT token', (done) => {
        chai.request(server)
          .post('/login')
          .send({})
          .end((err, res) => {
                (res).should.have.status(400);
                (res.body).should.be.a('object');
                (res.body.success).should.equal(false);
                done();
             });
    });

    it('it should not return pactched JSON object', (done) => {
        chai.request(server)
            .post('/login')
            .send({user_email: "xyz@gmail.com", user_password: "12345"})
            .end((err, res) => {
                chai.request(server)
                .post('/jsonPatch')
                .set('x-auth-token', res.body.data.authToken)
                .send({patch: '[{ "op": "replace", "path": "/baz", "value": "boo" },{ "op": "add", "path": "/hello", "value": ["world"] },{ "op": "remove", "path": "/foo" }]'})
                .end((error, response) => {
                    (response).should.have.status(400);
                    (response.body).should.be.a('object');
                    (response.body.success).should.equal(false);
                      done();
                });
            });
    });

    it('it should not return resized image', (done) => {
        chai.request(server)
            .post('/login')
            .send({user_email: "xyz@gmail.com", user_password: "12345"})
            .end((err, res) => {
                chai.request(server)
                .post('/thumbnail')
                .set('x-auth-token', res.body.data.authToken)
                .send({imgUrl: ""})
                .end((error, response) => {
                        (response).should.have.status(400);
                        (response.body).should.be.a('object');
                        (response.body.success).should.equal(false);
                      done();
                });
            });
    });
});