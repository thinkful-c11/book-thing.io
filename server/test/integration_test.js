const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
process.env.NODE_ENV = 'test';
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE} = require('../config');
const knex = require('knex')(TEST_DATABASE);
chai.use(chaiHttp);

const seedBookData = () => {
  console.info('seeding book data');
  const seedData = [];
  for (let i=0; i<10; i++) {
    seedData.push({
      title: 'Test title',
      author: 'test author',
      summary: 'test description'
    })
  }
  return knex.insert(seedData).into('books');
}

const seedUserData = () => {
  console.info('seeding user data');
  return knex('users')
    .insert({
      userid: 43214,
      firstname: 'Jimmy',
      lastname: 'BlueJeans',
      accesstoken: `1927goiugrlkjsghfd87g23`
    });
}
describe('Book-thing.io:', () => {

  before(() => runServer(undefined, TEST_DATABASE));

  after(() => {
    return knex.destroy()
      .then(closeServer);
  });

  beforeEach(() => {
    return seedUserData()
      .then(() => {
        return seedBookData();
      })
  });

  // afterEach test, delete the test items in the table
  afterEach(() => {
    return knex('books')
      .del()
      .then(() => {
        return knex('users')
        .del()
      })
      .catch((err) => {
        console.error('ERROR', err.message);
      });
  });

  describe('GET endpoints', () => {

    describe('library', () => {

      it('should return a status of 401 with wrong authentication', () => {
        return chai.request(app)
          .get('/api/library')
          .catch(err => {
            err.response.should.have.status(401);
            err.response.text.should.equal('Unauthorized');
          });
      })

      it('should return a status of 200', () => {
        let res;
        return chai.request(app)
               .get('/api/library')
               .set('Authorization', `Bearer 1927goiugrlkjsghfd87g23`)
               .then(_res => {
                 res = _res;
                 res.should.have.status(200);
               });
      });

      it('should return books with correct fields', () => {
        let res;
        return chai.request(app)
          .get('/api/library')
          .set('Authorization', `Bearer 1927goiugrlkjsghfd87g23`)
          .send()
          .then(_res => {
            res = _res;
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length.of.at.least(1);
            res.body.forEach(book => {
              book.should.be.a('object');
              book.should.have.property('author');
              book.should.have.property('summary');
              book.should.have.property('title');
              book.should.have.property('id').which.is.a('number');
            })
          });
      });

      it('should draw the data from a database', () => {
        const newBook = {
          title: 'Test title',
          author: 'test author',
          summary: 'test description'
        };

        return knex('books')
          .insert(newBook)
          .returning()
          .then(_res => {
            return chai.request(app)
              .get('/api/library')
              .set('Authorization', `Bearer 1927goiugrlkjsghfd87g23`)
              .send();
          })
          .then(_res => {
            let res = _res;
            let book = res.body[res.body.length-1];
            book.id.should.be.a('number');
            book.author.should.be.equal(newBook.author);
            book.summary.should.be.equal(newBook.summary);
            book.title.should.be.equal(newBook.title);
          });
      });
    })

    describe('google authentication', () => {
      it('should redirect to google authentication', done => {
        chai.request(app)
          .get('/api/auth/google').redirects(0)
          .set('Authorization', `Bearer 1927goiugrlkjsghfd87g23`)
          .end((err, res) => {
            let location = res.headers['location'].split("?")[0];
            location.should.equal(`https://accounts.google.com/o/oauth2/v2/auth`)
            done();
          })
      });
    });

    describe('logout', () => {
      it('should end the session and show homepage', done => {
        chai.request(app)
          .get('/api/auth/logout').redirects(0)
          .end((err, res) => {
            res.should.have.status(302)
            res.headers['location'].should.be.equal('/');
            res.headers['set-cookie'][0].split(';')[0].should.be.equal('accesstoken=');
            done();
          });
      });
    });

    // describe('/api/me', () => {
    //   app.use((req, res, next) => {
    //     req.user = {
    //       userid: 43214,
    //       firstname: 'Jimmy',
    //       lastname: 'BlueJeans',
    //       accesstoken: `1927goiugrlkjsghfd87g23`
    //     };
    //     next();
    //   });
    //   it ('should return the current user', () => {
    //     return chai.request(app)
    //       .get('/api/me')
    //       .send({
    //         userid: 43214,
    //         firstname: 'Jimmy',
    //         lastname: 'BlueJeans',
    //         accesstoken: '1927goiugrlkjsghfd87g23'
    //       })
    //       .then(user => {
    //         console.log(user);
    //       })
    //   })
    // })
  });

  describe('POST endpoint', () => {

    const newBook = {
      title: 'New Test title',
      author: 'New test author',
      summary: 'New test description'
    };

    it('should return a status of 401 when incorrect login info is provided', () => {
      return chai.request(app)
        .post('/api/library')
        .send(newBook)
        .catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        })
    });

    it('should add a book to the database', () => {

      return chai.request(app)
      .post('/api/library')
      .send(newBook)
      .set('Authorization', `Bearer 1927goiugrlkjsghfd87g23`)
      .then(res => {
        res.should.have.status(201);
        return knex('books')
          .where({
            title: newBook.title,
            author: newBook.author,
            summary: newBook.summary
          });
      })
      .then(_res => {
        let book = _res[0];
        book.should.have.property('id').which.is.a('number');
        book.title.should.be.equal(newBook.title);
        book.author.should.be.equal(newBook.author);
        book.summary.should.be.equal(newBook.summary);
      })
    });
  });

});

xdescribe('Testing server functions', () => {
  describe('Error handling', () => {
    it('should reject Promise upon error', () =>{


    });
  });
});
