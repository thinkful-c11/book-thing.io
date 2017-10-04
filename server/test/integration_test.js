'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
process.env.NODE_ENV = 'test';
const {app, runServer, closeServer} = require('../index');
const {DATABASE} = require('../config');
const {weightLists, recommendList} = require('../recommendations');
const knex = require('knex')(DATABASE);
chai.use(chaiHttp);

const user1 = {
  user_id: 43214,
  first_name: 'Jimmy',
  last_name: 'BlueJeans',
  access_token: '1927goiugrlkjsghfd87g23'
};

const user2 = {
  user_id: 41234,
  first_name: 'Arthur',
  last_name: 'Dent',
  access_token: 'idontthinkireallyneedthis'
};

// const newList = {
//   user_id: null,
//   list_name: 'Test List',
//   tags:'#test#dab#lit#fam#1#why',
//   books: []
// };

// const newList2 = {
//   user_id: null,
//   list_name: 'Test List 2',
//   tags:'#test#how#',
//   books: []
// };

// const newList3 = {
//   user_id: null,
//   list_name: 'Test List 3',
//   tags: '#test#'
// }

const seedListData = (userID) => {
  console.info('seeding list data');
  let books;
  let listID;
  let listID2;
  const newList = {
    user_id: userID,
    list_name: 'Test List',
    tags: '#test#dab#lit#fam#1#why',
    books: []
  };

  const newList2 = {
    user_id: userID,
    list_name: 'Test List 2',
    tags: '#test#how#',
    books: []
  };
  const seedData = [];
  return seedBookData().then(bookIDs => {
    books = bookIDs;
    const midIndexBooks = Math.floor(books.length / 2);
    //console.log("WHAT IS HAPPENING?!?!", midIndexBooks);
    newList.books = books.slice(0, midIndexBooks);
    newList2.books = books.slice(midIndexBooks, books.length - 1);
    return knex('lists').insert([
      {
        list_name: newList.list_name,
        tags: newList.tags
      }, {
        list_name: newList2.list_name,
        tags: newList2.tags
      }
    ]).returning('id');
  }).then(listsIDs => {
    listID = listsIDs[0];
    listID2 = listsIDs[1];
    const listBookIDs = [];
    newList.books.forEach(bookID => {
      listBookIDs.push({list_id: listID, book_id: bookID});
    });
    newList2.books.forEach(bookID => {
      listBookIDs.push({list_id: listID2, book_id: bookID});
    });

    return knex('books_to_lists').insert(listBookIDs);
  }).then(() => {
    return knex('lists_to_users').insert([
      {
        list_id: listID,
        user_id: userID
      }, {
        list_id: listID2,
        user_id: userID
      }
    ]);
  });
};

const seedBookData = () => {
  console.info('seeding book data');
  const seedData = [];
  let list_length = Math.floor(Math.random() * 20) + 4;
  for (let i = 0; i < list_length; i++) {
    seedData.push({title: `Test title ${i}`, author: `test author ${i}`, blurb: `test description ${i}`});
  }
  return knex.insert(seedData).into('books').returning('id');
};

const seedUserData = (user) => {
  console.info('seeding user data');
  return knex('users').insert(user).returning('id');
};

describe('Book-thing.io:', () => {

  before(() => runServer(undefined, DATABASE));

  after(() => {
    return knex.destroy().then(closeServer);
  });

  beforeEach(() => {
    console.log('Before');
    return knex('books_to_lists').del().then(() => {
      return knex('lists_to_users').del();
    }).then(() => {
      return knex('lists').del();
    }).then(() => {
      return knex('books').del();
    }).then(() => {
      return knex('users').del();
    }).then(() => {
      return seedUserData(user1);
    }).then(user => {
      return seedListData(user[0]);
    }).then(() => {
      return seedUserData(user2);
    }).then(user => {
      return seedListData(user[0]);
    }).catch((err) => {
      console.error('ERROR', err.message);
    });
  });

  // afterEach test, delete the test items in the table
  afterEach(() => {
    console.log('After');
    return knex('books_to_lists').del().then(() => {
      return knex('lists_to_users').del();
    }).then(() => {
      return knex('lists').del();
    }).then(() => {
      return knex('books').del();
    }).then(() => {
      return knex('users').del();
    }).catch((err) => {
      console.error('ERROR', err.message);
    });
  });

  describe('GET endpoints', () => {

    describe('library', () => {

      it('should return a status of 401 with wrong authentication', () => {
        return chai.request(app).get('/api/library').catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
      });

      it('should return a status of 200', () => {
        let res;
        return chai.request(app).get('/api/library').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(_res => {
          res = _res;
          res.should.have.status(200);
        });
      });

      it('should throw an error for invalid path', () => {
        return chai.request(app).get('/INVALID_PATH').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(() => {
          throw new Error('Path should not exist...but does!');
        }).catch(err => {
          err.should.have.status(404);
        });
      });

      it('should return books with correct fields', () => {
        let res;
        return chai.request(app).get('/api/library').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').send().then(_res => {
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

      //this is intentionally broken - please fix me
      xit('should throw error upon rejection', () => {
        return chai.request(app).get('/api/library').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(res => {
          console.log("res", res instanceof Promise);
          res.reject('Something bad happened');
        }).catch(err => {
          console.log("do we even get there?", err);
          err.should.have.status(500);
        });
      });

      it('should draw the data from a database', () => {
        const newBook = {
          title: 'New title',
          author: 'New author',
          blurb: 'New description'
        };

        return knex('books').insert(newBook).returning().then(_res => {
          return chai.request(app).get('/api/library').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').send();
        }).then(_res => {
          let res = _res;
          let book = res.body[res.body.length - 1];
          book.id.should.be.a('number');
          book.author.should.be.equal(newBook.author);
          book.blurb.should.be.equal(newBook.blurb);
          book.title.should.be.equal(newBook.title);
        });
      });
    });

    describe('google authentication', () => {

      it('should redirect to google authentication', done => {
        chai.request(app).get('/api/auth/google').redirects(0).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').end((err, res) => {
          let location = res.headers['location'].split('?')[0];
          location.should.equal('https://accounts.google.com/o/oauth2/v2/auth');
          done();
        });
      });
    });

    describe('logout', () => {

      it('should end the session and show homepage', done => {
        chai.request(app).get('/api/auth/logout').redirects(0).end((err, res) => {
          res.should.have.status(302);
          res.headers['location'].should.be.equal('/');
          res.headers['set-cookie'][0].split(';')[0].should.be.equal('accessToken=');
          done();
        });
      });
    });

    describe('/api/me', () => {

      it('should return the current user', () => {
        return chai.request(app).get('/api/me').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').send().then(res => {
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
      it('should return all lists associated with the user', () => {
        return knex('users').select('id').then(res => {
          return chai.request(app).get(`/api/usersLists/${res[0].id}`).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23');
        }).then(res => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an('array');
          res.body.forEach(list => {
            list.should.have.property('userId').which.is.a('number');
            list.should.have.property('listId').which.is.a('number');
            list.created_flag.should.be.true;
            list.listTitle.should.be.a('string');
            list.tags.should.be.a('string');
            list.liked_flag.should.be.true;
            list.likes.should.be.a('number').which.is.equal(0);
            list.should.have.property('books');
            list.books.should.be.an('array');
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

    describe('/api/recommendation/', () => {

      it('should return 401 when wrong authorization is passed', () => {
        return chai.request(app).get('/api/recommendation/12345').send().catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
      });

      it('should return 400 when given wrong inputs', () => {
        return chai.request(app).get('/api/recommendation/yay').set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').catch(err => {
          err.response.should.have.status(400);
          err.response.text.should.equal('Invalid Input');
        });
      });

      it('should return 200 when correct authorization is passed', () => {
        return knex('lists').limit(1).then(results => {
          let listID = results[0].id;
          return chai.request(app).get(`/api/recommendation/${listID}`).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(_res => {
            _res.should.have.status(200);
            _res.should.be.json;
          });
        });
      });

      it('should return an array of lists', () => {
        return knex('lists').limit(1).then(results => {
          let listID = results[0].id;
          return chai.request(app).get(`/api/recommendation/${listID}`).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(_res => {
            let recList = _res.body;
            _res.should.have.status(200);
            recList.should.be.an('Object');
            recList.should.have.property('id').which.is.a('number');
            recList.id.should.not.be.equal(listID);
            recList.should.have.property('creator_id').which.is.a('number');
            recList.should.have.property('list_name').which.is.a('string');
            recList.should.have.property('likes_counter').which.is.a('number');
            recList.should.have.property('tags').which.is.a('string');
            recList.should.have.property('books').which.is.an('array');
            recList.should.have.property('weight').which.is.a('number');
            recList.should.have.property('creator_id').which.is.a('number');
            recList.should.have.property('creator_name').which.is.a('string');
            recList.creator_name.should.equal('Arthur');
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
        {
          title: 'Bridget Jones\'s Diary',
          author: 'Helen Fielding',
          blurb: 'Love Bridget in all her poor-decision-making glory!'
        }, {
          title: 'The Devil Wears Prada',
          author: 'Lauren Weisberger',
          blurb: 'How do you spell Gabbana?'
        }
      ]
    };

    describe('/api/library POSTS', () => {
      it('should return a status of 401 when incorrect login info is provided', () => {
        return chai.request(app).post('/api/library').send(newBook).catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
      });

      it('should add a book to the database', () => {

        return chai.request(app).post('/api/library').send(newBook).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(res => {
          res.should.have.status(201);
          return knex('books').where({title: newBook.title, author: newBook.author, blurb: newBook.blurb});
        }).then(_res => {
          let book = _res[0];
          book.should.have.property('id').which.is.a('number');
          book.title.should.be.equal(newBook.title);
          book.author.should.be.equal(newBook.author);
          book.blurb.should.be.equal(newBook.blurb);
        });
      });
    });

    describe('/api/list POSTS', () => {
      it('should return the id of a user-list association', () => {

        return knex('users').where({user_id: 43214}).then(user => {
          newList.user_id = user[0].id;
          return chai.request(app).post('/api/list').send(newList).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').then(res => {
            res.should.have.status(201);
            res.body.should.be.an('array');
            res.body[0].should.be.a('number');
            return knex('lists').where({list_name: newList.list_name}).join('books_to_lists', 'lists.id', '=', 'books_to_lists.list_id').join('books', 'books.id', '=', 'books_to_lists.book_id').select('lists.id', 'lists.list_name', 'lists.tags', 'lists.likes_counter', 'books_to_lists.book_id', 'books.title', 'books.author', 'books.blurb');
          }).then(_res => {
            let list = _res[0];
            _res.length.should.be.equal(2);
            list.should.have.property('id').which.is.a('number');
            list.list_name.should.be.equal(newList.list_name);
            list.tags.should.be.equal(newList.tags);
            list.likes_counter.should.be.equal(0);
          });
        });
      });
    });
  });

  describe('PUT endpoints', () => {

    describe('api/lists/likes', () => {

      it('should return a status of 401 when incorrect login info is provided', () => {
        return chai.request(app).put('/api/lists/likes/124234').send().catch(err => {
          err.response.should.have.status(401);
          err.response.text.should.equal('Unauthorized');
        });
      });

      it('should return a status of 200 when correct login info is provided', () => {
        let listID;
        return knex('lists').select('id').then(_id => {
          listID = _id[0].id;
          return chai.request(app).put(`/api/lists/likes/${listID}`).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').send();
        }).then(_res => {
          _res.should.have.status(200);
          _res.should.be.json;
        });
      });

      it('should increment the likes counter of the correct list', () => {
        let listID;
        let likesCounter;
        return knex('lists').select('id').then(_id => {
          listID = _id[0].id;
          return chai.request(app).put(`/api/lists/likes/${listID}`).set('Authorization', 'Bearer 1927goiugrlkjsghfd87g23').send();
        }).then(res => {
          res.should.have.status(200);
          res.should.be.json;
          likesCounter = res.body[0];
          return knex('lists').where('id', '=', listID).select('likes_counter');
        }).then(_res => {
          _res[0].likes_counter.should.equal(likesCounter);
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
          id: 1,
          title: 'Hitchhiker\'s Guide to the Galaxy',
          author: 'Douglas Adams',
          blurb: 'Marvin is the mopiest robot, ever!'
        }, {
          id: 2,
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
            id: 17,
            title: 'Twilight',
            author: 'Stephanie Meyer',
            blurb: 'Team Edward, 4ever!'
          }, {
            id: 18,
            title: 'The Hunger Games',
            author: 'Suzanne Collins',
            blurb: 'Team Peeta, 4ever! He is the best'
          }
        ]
      }, {
        list_id: 2,
        list_name: 'Science fiction in Space',
        tags: '#robots#space#scifi#movies',
        likes_counter: 5,
        books: [
          {
            id: 35,
            title: 'Do Android\'s Dream of Electric Sheep?',
            author: 'Phillip K. Dick',
            blurb: 'Must watch Blade Runner soon'
          }, {
            id: 36,
            title: 'Ender\'s Game',
            author: 'Orson Scott Card',
            blurb: 'WOW, the movie... just wow'
          }, {
            id: 37,
            title: 'Leviathan Wakes',
            author: 'S.A. Corey',
            blurb: 'Loved this. Can\'t wait to watch the show!'
          }
        ]
      }, {
        list_id: 7,
        list_name: 'Fun books',
        tags: '#space#scifi#dystopia#fun',
        likes_counter: 100,
        books: [
          {
            id: 100,
            title: 'Saga, Vol 1',
            author: 'Brian K. Vaughan',
            blurb: 'So great! Really, really want to read more!'
          }, {
            id: 101,
            title: 'Ready Player One',
            author: 'Ernest Cline',
            blurb: 'The 80s references really make this book'
          }, {
            id: 1,
            title: 'Hitchhiker\'s Guide to the Galaxy',
            author: 'Douglas Adams',
            blurb: '42! But what is the question?'
          }
        ]
      }
    ];

    it('weightList function returns weights', () => {

      let returnVal;
      returnVal = weightLists(myList, [
        ...otherLists,
        myList
      ]);
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
    it('should reject Promise upon error', () => {});
  });
});
