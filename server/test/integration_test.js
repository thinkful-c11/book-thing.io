const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
process.env.NODE_ENV = 'test';
// const assert = chai.assert();
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE} = require('../config');
const knex = require('knex')(TEST_DATABASE);
chai.use(chaiHttp);


describe('Book-thing.io:', () => {

  before(() => runServer(undefined, TEST_DATABASE));

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

  describe('GET endpoints', () => {
    xit('should return a status of 200', () => {
      let res;
      return chai.request(app)
             .get('/api/library')
             .then(_res => {
               res = _res;
               res.should.have.status(200);
             });
    });

    xit('should return books with correct fields', () => {
      let res;
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
          res = _res;
          res.should.be.json;
          res.body.should.be.an('array');
          res.body.should.have.length.of.at.least(1);
        });
    });

    xit('should draw the data from a database', () => {
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
            book.id.should.be.a('number');
            book.author.should.be.equal(newItem.author);
            book.summary.should.be.equal(newItem.summary);
            book.title.should.be.equal(newItem.title);
          });
        });
    });

    it('should redirect to google authentication', done => {
       chai.request(app)
      .get('/api/auth/google').redirects(0)
      .end((err, res) => {
        let location = res.headers['location'].split("?")[0];
        location.should.equal(`https://accounts.google.com/o/oauth2/v2/auth`)
        // expect(res.headers['location']).to.match(/^https:\/\/accounts.google.com\/o\/oath2/);
        done();
      })
    })
  });

  describe('POST endpoint', () => {
    xit('should add a book to the database', () => {
      const newItem = {
        title: 'Test title',
        author: 'test author',
        summary: 'test description'
      };
      return chai.request(app)
      .post('/api/library')
      .send(newItem)
      .then(res => {
        res.should.have.status(201);
        return knex('books')
          .where({
            title: newItem.title,
            author: newItem.author,
            summary: newItem.summary
          });
      })
      .then(_res => {
        let book = _res[0];
        book.should.have.property('id').which.is.a('number');
        book.title.should.be.equal(newItem.title);
        book.author.should.be.equal(newItem.author);
        book.summary.should.be.equal(newItem.summary);
      });
    });
  });

});

xdescribe('Testing server functions', () => {

  describe('Error handling', () => {
    it('should reject Promise upon error', () =>{


    });
  });
});
