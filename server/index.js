const express = require('express');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { DATABASE, PORT, CLIENT_ID, CLIENT_SECRET } = require('./config');
const BearerStrategy = require('passport-http-bearer').Strategy;
const parser = require('body-parser');
const passport = require('passport');
const app = express();

let secret = {
  CLIENT_ID,
  CLIENT_SECRET
}

app.use(passport.initialize());
app.use(parser.json());

passport.use(
  new GoogleStrategy({
    clientID: secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    let user;
    knex('users')
      .where('user_id', profile.id)
      .then(_user => {
        user = _user[0];
        if(!user) {
          return knex('users')
            .insert({
              user_id: profile.id,
              first_name: profile.name.givenName,
              last_name: profile.name.familyName,
              access_token: accessToken
            })
            .returning('*');
        }else {
          return knex('users')
            .where('user_id', user.user_id)
            .update({
              access_token: accessToken
            })
            .returning('*');
        }
      })
      .then(user => {
        return cb(null, user[0]);
      })
  }
));

passport.use(
  new BearerStrategy((token, done) => {
    return knex('users')
    .where('access_token', token)
    .then(_user => {
      let user = _user[0];
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch(err => console.log(err))
  })
)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/api/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false
  }),
  (req, res) => {
    res.cookie('accessToken', req.user.access_token, {expires: 0});
    res.redirect('/');
  });

app.get('/api/me',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
    res.status(200).json({id: req.user.id,
              user_id: req.user.user_id,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
            });
})

app.get('/api/library',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
    return knex
      .select('*')
      .from('books')
      .then(results => {
        res.status(200).json(results);
      })
      .catch(error => {
        res.status(500);
        console.error('Internal server error', error);
      });
});

app.get('/api/usersLists/:id',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
    return knex('lists_to_users')
      .where({user_id: req.params.id})
      .join('lists', 'lists_to_users.list_id', '=', 'lists.id')
      .join('books_to_lists', 'lists.id', '=', 'books_to_lists.list_id')
      .join('books', 'books.id', '=', 'books_to_lists.book_id')
      .select('lists_to_users.user_id', 'lists_to_users.list_id', 'lists_to_users.created_flag',
              'lists.list_name', 'lists.tags', 'books_to_lists.book_id', 'books.title',
              'books.author', 'books.blurb', 'lists_to_users.liked_flag', 'lists.likes_counter')
      .then(_results => {
      const results = {
        liked_flag: _results[0].liked_flag,
        likes: _results[0].likes_counter,
        userId: _results[0].user_id,
        listId: _results[0].list_id,
        created_flag: _results[0].created_flag,
        listTitle: _results[0].list_name,
        tags: _results[0].tags,
        books: []
      }
      _results.forEach(item => {
        results.books.push({
          bookTitle: item.title,
          bookAuthor: item.author,
          blurb: item.blurb
        })
      })
        res.status(200).json(results);
      })
      .catch(error => {
        res.status(500);
        console.error('Internal server error', error);
      });
  });

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.post('/api/library',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
   return knex('books')
    .insert(req.body)
    .returning('id')
    .then(results => {
      res.status(201).send();
    })
    .catch(error => {
      res.status(500);
      console.error('Internal server error', error);
    })
});

app.post('/api/list',
  passport.authenticate('bearer', {session: false}),
  (req, res) => {
    let listID;
    return knex('lists')
     .insert(
      {list_name: req.body.list_name,
        tags: req.body.tags})
      .returning('id')
      .then(res => {
        listID = res[0];
        return knex('books')
          .insert(req.body.books)
          .returning('id');
      })
      .then(_res => {
        const bookIDs = _res;
        const listBookIDs = [];

        bookIDs.forEach( bookID => {
          listBookIDs.push(
            {list_id: `${listID}`,
              book_id: `${bookID}`
            });
        });

        return knex('books_to_lists').insert(listBookIDs);
      })
      .then( () => {
        return knex('lists_to_users')
          .insert(
          {list_id: `${listID}`,
            user_id: `${req.body.user_id}`,
            liked_flag: false
          }).returning('id');
      })
      .then(results => {
        res.status(201).json(results);
      })
      .catch(error => {
        res.status(500);
        console.error('Internal server error', error);
      });
  });


app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, '../client/build', 'index.html');
  res.sendFile(index);
});

let server;
let knex;

const runServer = (port = PORT, database = DATABASE) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Database: ', database, 'Port: ', port);
      knex = require('knex')(database);
      server = app.listen(port, () => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

const closeServer = () => {
  return knex.destroy().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err); //
        }
        resolve();
      });
    });
  });
};

if (require.main === module) {
  runServer().catch(err => { //
    console.error(`Can't start server: ${err}`);
    throw err; //
  });
}
module.exports = { app, runServer, closeServer };
