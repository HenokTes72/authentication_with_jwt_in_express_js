require('dotenv').config();
process.env.NODE_ENV = 'test';
console.log('The current environment is ', process.env.NODE_ENV);

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../main');
let should = chai.should();


chai.use(chaiHttp);

describe('Test signup user', () => {
    it('It should respond with unprocessible request', (done) => {
        let newUser = {
            username: 'ab',
            email: 'myemail'
        };
        chai.request(server)
            .post('/users/signup')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(422);
                done();
            })
    });
})
