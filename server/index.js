const express = require("express");
const path = require("path");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { TEST_DATABASE, PORT } = require("./config");
const BearerStrategy = require("passport-http-bearer").Strategy;
// let Strategy;
const parser = require("body-parser");
const passport = require("passport");

const app = express();

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
};

if (process.env.NODE_ENV !== "production") {
  secret = require("./secret");
}

app.use(passport.initialize());
app.use(parser.json());

// if (process.env.NODE_ENV == 'test') {
//   Strategy = require('passport-mock').Strategy;
// } else {
//   Strategy = require('passport-google-oauth20').Strategy;
// }

passport.use(
  new GoogleStrategy(
    {
      clientID: secret.CLIENT_ID,
      clientSecret: secret.CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, cb) => {
      let user;
      knex("users")
        .where("userid", profile.id)
        .then(_user => {
          user = _user[0];
          if (!user) {
            return knex("users")
              .insert({
                userid: profile.id,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                accesstoken: accessToken
              })
              .returning("*");
          } else {
            return knex("users")
              .where("userid", user.userid)
              .update({
                accesstoken: accessToken
              })
              .returning("*");
          }
        })
        .then(user => {
          return cb(null, user[0]);
        });
    }
  )
);

passport.use(
  new BearerStrategy((token, done) => {
    return knex("users")
      .where("accesstoken", token)
      .then(_user => {
        let user = _user[0];
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => console.log(err));
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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

app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false
  }),
  (req, res) => {
    res.cookie("accessToken", req.user.accesstoken, { expires: 0 });
    res.redirect("/");
  }
);

app.get(
  "/api/me",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      userid: req.user.userid,
      firstname: req.user.firstname,
      lastname: req.user.lastname
    });
  }
);

app.get(
  "/api/library",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    return knex
      .select("*")
      .from("books")
      .then(results => {
        res.json(results);
      })
      .catch(error => {
        res.status(500);
        console.error("Internal server error", error);
      });
  }
);

app.get("/api/auth/logout", (req, res) => {
  req.logout();
  res.clearCookie("accesstoken");
  res.redirect("/");
});

app.post(
  "/api/library",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    return knex("books")
      .insert(req.body)
      .returning("id")
      .then(results => {
        res.status(201).send();
      })
      .catch(error => {
        res.status(500);
        console.error("Internal server error", error);
      });
  }
);

app.use(express.static(path.resolve(__dirname, "../client/build")));

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
  runServer().catch(err => {
    //
    console.error(`Can't start server: ${err}`);
    throw err; //
  });
}
module.exports = { app, runServer, closeServer };
