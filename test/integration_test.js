const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../index');
chai.use(chaiHttp);


describe("Get endpoint", function() {
  it('should return a status of 200', function() {
    let res;
    return chai.request(app)
           .get('/resource')
           .then(_res => {
             res = _res;
             res.should.have.status(200);
           })
  })
})
