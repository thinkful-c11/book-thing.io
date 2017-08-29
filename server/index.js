const express = require("express");
const path = require("path");
const { TEST_DATABASE, PORT } = require("./config");
const BearerStrategy = require("passport-http-bearer").Strategy;
let Strategy;
const parser = require("body-parser");
const passport = require("passport");

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(parser.json());

app.use(passport.initialize());

if (process.env.NODE_ENV == 'test') {
  Streategy = require('passport-mock').Strategy;
} else {
  Strategy = require('passport-google-oath20').Strategy;
}

passport.use(
  new Strategy({
    clientID: secret.CLIENT_ID,
    clientSecret: secret.CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    let user;
    knex
      .select()
      .from("users")
      .where("userID", "=", profile.id)
      .then(_user => {
        user = _user;
        if(!user) {
          return knex("users")
            .insert({
              userID: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.lastName,
              accessToken: accessToken
            });
        }
        return knex("users")
               .where("userID", "=", user.userID)
               .update({
                 accessToken: accessToken
               });
      })
      .then(user => {
        return cb(null, user);
      })
  }
));

passport.use(
  new BearerStrategy((token, done) => {
    knex("users")
    .where("accessToken", "=", token)
    .then(_user => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user[0]);
    })
    .catch(err => console.log(err))
  })
)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/library",
  (req, res) => {
  knex
    .select("*")
    .from("books")
    .then(results => {
      res.json(results);
    })
    .catch(error => {
      res.status(500);
      console.error("Internal server error", error);
    });
});

app.post("/api/library", (req, res) => {
  return knex("books")
    .insert(req.body)
    .returning('id')
    .then(results => {
      res.status(201).send();
    })
    .catch(error => {
      res.status(500);
      console.error("Internal server error", error);
    })
})

app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, "../client/build", "index.html");
  res.sendFile(index);
});

let server;
let knex;

const runServer = (port = PORT, database = TEST_DATABASE) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Database: ", database, "Port: ", port);
      knex = require("knex")(database);
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
