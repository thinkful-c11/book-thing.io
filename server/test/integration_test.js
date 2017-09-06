const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const knexCleaner = require('knex-cleaner');
process.env.NODE_ENV = 'test';
const {app, runServer, closeServer} = require('../index');
const {TEST_DATABASE} = require('../config');
const {weightLists, recommendList} = require('../recommendations');
const knex = require('knex')(TEST_DATABASE);
chai.use(chaiHttp);

const seedListData = (userID) => {
  console.info('seeding list data');
  let books;
  let listID;
  let listID2;
  const newList = {
    user_id: userID,
    list_name: 'Test List',
    tags:'#test#dab#lit#fam',
    books: []
  };
  const newList2 = {
    user_id: userID,
    list_name: 'Test List 2',
    tags:'#test',
    books: []
  };
  const seedData = [];
  return seedBookData()
  .then(res => {
    books = res;
    newList.books = books;
    newList2.books = books;
    return knex('lists')
      .insert(
      [
        {
          list_name: newList.list_name,
          tags: newList.tags
        },
        {
          list_name: newList2.list_name,
          tags: newList2.tags
        }
      ]
      )
      .returning('id');
  })
  .then(res => {
    listID = res[0];
    listID2 = res[1];
    const listBookIDs = [];
    newList.books.forEach(bookID => {
      listBookIDs.push(
        {
          list_id: listID,
          book_id: bookID
        }
      );
    });
    newList2.books.forEach(bookID => {
      listBookIDs.push(
        {
          list_id: listID2,
          book_id: bookID
        }
      );
    });

    return knex('books_to_lists').insert(listBookIDs);
  })
  .then( () => {
    return knex('lists_to_users')
      .insert(
      [
        {
          list_id: listID,
          user_id: userID,
          liked_flag: false
        },
        {
          list_id: listID2,
          user_id: userID,
          liked_flag: false
        }
      ]
      );
  });
};

const seedBookData = () => {
  console.info('seeding book data');
  const seedData = [];
  for (let i=0; i<10; i++) {
    seedData.push({
      title: `Test title ${i}`,
      author: `test author ${i}`,
      blurb: `test description ${i}`
    });
  }
  return knex.insert(seedData).into('books').returning('id');
};

const seedUserData = () => {
  console.info('seeding user data');
  return knex('users')
    .insert({
      user_id: 43214,
      first_name: 'Jimmy',
      last_name: 'BlueJeans',
      access_token: '1927goiugrlkjsghfd87g23'
    })
    .returning('id');
};

describe('Book-thing.io:', () => {

  before(() => runServer(undefined, TEST_DATABASE));

  after(() => {
    return knex.destroy()
      .then(closeServer);
  });

  beforeEach(() => {
    console.log('Before');
    return knexCleaner
      .clean(knex)
      .then(() => {
        return seedUserData();
      })
      .then(user => {
        return seedListData(user[0]);
      })
      .catch((err) => {
        console.error('ERROR', err.message);
      });
  });

  // afterEach test, delete the test items in the table
  afterEach(() => {
    console.log('After');
    return knexCleaner
      .clean(knex)
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
      });

      it('should return a status of 200', () => {
        let res;
        return chai.request(app)
          .get('/api/library')
          .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
          .then(_res => {
            res = _res;
            res.should.have.status(200);
          });
      });

      it('should return books with correct fields', () => {
        let res;
        return chai.request(app)
          .get('/api/library')
          .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
          .send()
          .then(_res => {
            res = _res;
            res.should.be.json;
            res.body.should.be.an('array');
            res.body.should.have.length.of.at.least(1);
            res.body.forEach(book => {
              book.should.be.a('object');
              book.should.have.property('author');
              book.should.have.property('blurb');
              book.should.have.property('title');
              book.should.have.property('id').which.is.a('number');
            });
          });
      });

      it('should draw the data from a database', () => {
        const newBook = {
          title: 'New title',
          author: 'New author',
          blurb: 'New description'
        };

        return knex('books')
          .insert(newBook)
          .returning()
          .then(_res => {
            return chai.request(app)
              .get('/api/library')
              .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
              .send();
          })
          .then(_res => {
            let res = _res;
            let book = res.body[res.body.length-1];
            book.id.should.be.a('number');
            book.author.should.be.equal(newBook.author);
            book.blurb.should.be.equal(newBook.blurb);
            book.title.should.be.equal(newBook.title);
          });
      });
    });

    describe('google authentication', () => {

      it('should redirect to google authentication', done => {
        chai.request(app)
          .get('/api/auth/google').redirects(0)
          .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
          .end((err, res) => {
            let location = res.headers['location'].split('?')[0];
            location.should.equal('https://accounts.google.com/o/oauth2/v2/auth');
            done();
          });
      });
    });

    describe('logout', () => {

      it('should end the session and show homepage', done => {
        chai.request(app)
          .get('/api/auth/logout').redirects(0)
          .end((err, res) => {
            res.should.have.status(302);
            res.headers['location'].should.be.equal('/');
            res.headers['set-cookie'][0].split(';')[0].should.be.equal('accessToken=');
            done();
          });
      });
    });

    describe('/api/me', () => {

      it ('should return the current user', () => {
        return chai.request(app)
          .get('/api/me')
          .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
          .send()
          .then(res => {
            let user = res.body;
            res.should.have.status(200);
            res.should.be.json;
            user.id.should.be.a('number');
            user.user_id.should.be.equal('43214');
            user.first_name.should.be.equal('Jimmy');
            user.last_name.should.be.equal('BlueJeans');
          });
      });
    });

    describe('/api/usersLists', () => {
      it ('should return all lists associated with the user', () => {
        return knex('users')
        .select('id')
        .then(res => {
          return chai.request(app)
            .get(`/api/usersLists/${res[0].id}`)
            .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23');
        })
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('array').which.has.length(2);
          res.body.forEach(list => {
            list.should.have.property('userId').which.is.a('number');
            list.should.have.property('listId').which.is.a('number');
            list.created_flag.should.be.true;
            list.listTitle.should.be.a('string');
            list.tags.should.be.a('string');
            list.liked_flag.should.be.false;
            list.likes.should.be.a('number').which.is.equal(0);
            list.should.have.property('books');
            list.books.should.be.an('array').which.has.length(10);
            list.books.forEach(book => {
              book.should.be.a('object');
              book.should.have.property('bookTitle').which.is.a('string');
              book.should.have.property('bookAuthor').which.is.a('string');
              book.should.have.property('blurb').which.is.a('string');
            });
          });
        });
      });
    });
  });

  describe('POST endpoint', () => {

    const newBook = {
      title: 'New Test title',
      author: 'New test author',
      blurb: 'New test description'
    };

    const newList = {
      user_id: 43214,
      list_name: 'Chick Lit',
      tags: '#chicklit#womensfic#girly#funny',
      books: [
        { title: 'Bridget Jones\'s Diary',
          author: 'Helen Fielding',
          blurb: 'Love Bridget in all her poor-decision-making glory!'
        },
        {
          title: 'The Devil Wears Prada',
          author: 'Lauren Weisberger',
          blurb: 'How do you spell Gabbana?'
        }
      ]
    };

    it('should return a status of 401 when incorrect login info is provided', () => {
      return chai.request(app)
        .post('/api/library')
        .send(newBook)
        .catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
    });

    it('should add a book to the database', () => {

      return chai.request(app)
      .post('/api/library')
      .send(newBook)
      .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
      .then(res => {
        res.should.have.status(201);
        return knex('books')
          .where({
            title: newBook.title,
            author: newBook.author,
            blurb: newBook.blurb
          });
      })
      .then(_res => {
        let book = _res[0];
        book.should.have.property('id').which.is.a('number');
        book.title.should.be.equal(newBook.title);
        book.author.should.be.equal(newBook.author);
        book.blurb.should.be.equal(newBook.blurb);
      });
    });

    it('should return the id of a user-list association', () => {

      return knex('users').where({user_id: 43214})
        .then((_res) => {
          newList.user_id = _res[0].id;
          return chai.request(app)
          .post('/api/list')
          .send(newList)
          .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
          .then(res => {
            res.should.have.status(201);
            res.body.should.be.an('array');
            res.body[0].should.be.a('number');
            return knex('lists')
              .where({
                list_name: newList.list_name
              })
              .join('books_to_lists', 'lists.id', '=', 'books_to_lists.list_id')
              .join('books', 'books.id', '=', 'books_to_lists.book_id')
              .select('lists.id','lists.list_name', 'lists.tags', 'lists.likes_counter', 'books_to_lists.book_id', 'books.title',
                'books.author', 'books.blurb');
          })
          .then(_res => {
            let list = _res[0];
            list.should.have.property('id').which.is.a('number');
            list.list_name.should.be.equal(newList.list_name);
            list.tags.should.be.equal(newList.tags);
            list.likes_counter.should.be.equal(0);
          });
        });
    });
  });

  describe ('PUT endpoints', () => {

    describe ('api/lists/likes', () => {

      it ('should return a status of 401 when incorrect login info is provided', () => {
        return chai.request(app)
          .put('/api/lists/likes/124234')
          .send()
          .catch(err => {
            err.response.should.have.status(401);
            err.response.text.should.equal('Unauthorized');
          });
      });

      it ('should return a status of 200 when correct login info is provide', () => {
        let listID;
        return knex('lists')
          .select('id')
          .then(_id => {
            listID = _id[0].id;
            return chai.request(app)
              .put(`/api/lists/likes/${listID}`)
              .set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23')
              .send();
          })
          .then(res => {
            res.should.have.status(200);
            return knex('lists')
              .where('id', '=', listID)
              .select('likes_counter');
          })
          .then(_res => {
            _res[0].likes_counter.should.equal(1);
          });
      });
    });
  });

  describe('Recommendations algorithm testing', () => {

    

    const myList = {
      list_id: 42,
      list_name: 'Sci-fi',
      tags: '#scifi#space#funny#robots',
      likes_counter: 42,
      books: [
        {
          book_id: 1,
          title: 'Hitchhiker\'s Guide to the Galaxy',
          author: 'Douglas Adams',
          blurb: 'Marvin is the mopiest robot, ever!'
        },
        {
          book_id: 2,
          title: 'I, Robot',
          author: 'Isaac Asimov',
          blurb: 'Save me from this AI madness'
        }
      ]
    };

    const otherLists = [

      {
        list_id: 17,
        list_name: 'YA fiction',
        tags: '#ya#greatbooks#love#girly',
        likes_counter: 12334354,
        books: [
          {
            book_id: 17,
            title: 'Twilight',
            author: 'Stephanie Meyer',
            blurb: 'Team Edward, 4ever!'
          },
          {
            book_id: 18,
            title: 'The Hunger Games',
            author: 'Suzanne Collins',
            blurb: 'Team Peeta, 4ever! He is the best'
          }
        ]
      },
      {
        list_id: 2,
        list_name: 'Science fiction in Space',
        tags: '#robots#space#scifi#movies',
        likes_counter: 5,
        books : [
          {
            book_id: 35,
            title: 'Do Android\'s Dream of Electric Sheep?',
            author: 'Phillip K. Dick',
            blurb: 'Must watch Blade Runner soon'
          },
          {
            book_id: 36,
            title: 'Ender\'s Game',
            author: 'Orson Scott Card',
            blurb: 'WOW, the movie... just wow'
          },
          {
            book_id: 37,
            title: 'Leviathan Wakes',
            author: 'S.A. Corey',
            blurb: 'Loved this. Can\'t wait to watch the show!'
          }
        ]
      },
      {
        list_id: 7,
        list_name: 'Fun books',
        tags: '#space#scifi#dystopia#fun',
        likes_counter: 100,
        books: [
          {
            book_id: 100,
            title: 'Saga, Vol 1',
            author: 'Brian K. Vaughan',
            blurb: 'So great! Really, really want to read more!'
          },
          {
            book_id: 101,
            title: 'Ready Player One',
            author: 'Ernest Cline',
            blurb: 'The 80s references really make this book'
          },
          {
            book_id: 1,
            title: 'Hitchhiker\'s Guide to the Galaxy',
            author: 'Douglas Adams',
            blurb: '42! But what is the question?'
          }
        ]
      }
    ];

    it('weightList function returns weights', () => {

      let returnVal;
      returnVal = weightLists(myList, otherLists);
      returnVal.should.be.an('array');
      returnVal.should.have.length(3);
      returnVal[0].should.have.property('weight').which.is.a('number');
    });

    it('recommendList function returns recommendation', () => {

      let returnVal;
      returnVal = recommendList(weightLists(myList, otherLists));
      returnVal.should.be.an('Object');
      returnVal.should.have.property('weight').which.is.a('number');
      returnVal.weight.should.equal(3);
    });

  });


});

xdescribe('Testing server functions', () => {
  describe('Error handling', () => {
    it('should reject Promise upon error', () =>{


    });
  });
});
