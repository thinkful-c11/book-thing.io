const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../index');
chai.use(chaiHttp);


describe("Get endpoint", () => {
  it('should return a status of 200', () => {
    let res;
    return chai.request(app)
           .get('/api/library')
           .then(_res => {
             res = _res;
             res.should.have.status(200);
           })
  })

  it('should return books with correct fields', () => {
    let res;
    return chai.request(app)
      .get('/api/library')
      .then(_res => {
        res = _res;
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.an('array');
        res.body.should.have.length.of.at.least(1);

        res.body.forEach(book => {
          book.should.be.an('object');
          book.should.include.keys('title', 'author', 'description', 'id');
        });
      })
  })

  xit('should draw the data from a database', () => {
      //pull data from the database
      //get the data from the endpoint
      //make sure the data matches
  })
})
