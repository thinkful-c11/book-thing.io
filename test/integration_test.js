const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
// const assert = chai.assert();
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE} = require('../config');
const knex = require('knex')(TEST_DATABASE);
chai.use(chaiHttp);

describe('Book-thing.io:', () => {

  before(() => runServer(TEST_DATABASE));

  after(() => {
    return knex.destroy()
      .then(closeServer);
  });

  beforeEach(() => {
  return knex('books')
    .del()
    .catch((err) => {
      console.error('ERROR', err.message);
    });
  });

  // afterEach test, delete the test items in the table
  afterEach(() => {
    return knex('books')
      .del()
      .catch((err) => {
        console.error('ERROR', err.message);
      });
  });

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
            book.should.include.keys('title', 'author', 'summary', 'id');
          });
        });
    });

    it('should draw the data from a database', () => {
        const newItem = {
          title: 'Test title',
          author: 'test author',
          summary: 'test description'
        };
        return knex('books')
            .insert(newItem)
            .returning()
            .then(_res => {
              return chai.request(app).get('/api/library').send();
            })
            .then(_res => {
              let res = _res;
              res.body.forEach((book, index) => {
                book.id.should.be.an("number");
                book.author.should.be.equal(newItem.author);
                book.summary.should.be.equal(newItem.summary);
                book.title.should.be.equal(newItem.title);
             })
           });
    });
  });
})
