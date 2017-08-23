const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../index');
const {DATABASE} = require('../config');
chai.use(chaiHttp);

describe('Book-thing.io:', () => {

  describe("GET endpoint", () => {
    it('should return a status of 200', () => {
      let res;
      return chai.request(app)
             .get('/api/library')
             .then(_res => {
               res = _res;
               res.should.have.status(200);
             });
    });

    it('should return books with correct fields', () => {
      let res;
      return chai.request(app)
        .get('/api/library')
        .then(_res => {
          res = _res;
          res.should.be.json;
          res.body.should.be.an('array');
          res.body.should.have.length.of.at.least(1);

          res.body.forEach(book => {
            book.should.be.an('object');
            book.should.include.keys('title', 'author', 'description', 'id');
          });
        });
    });

    it('should draw the data from a database', () => {
        let res;
        return chai.request(app)
          .get('/api/library')
          .then(_res => {
            res = _res;
            res.body.forEach((book, index) => {
              book.id.should.be.equal(DATABASE[index].id);
              book.author.should.be.equal(DATABASE[index].author);
              book.description.should.be.equal(DATABASE[index].description);
              book.title.should.be.equal(DATABASE[index].title);
            })
          });
    });
  });
})
