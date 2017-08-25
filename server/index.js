const express = require("express");
const path = require("path");
const { DATABASE, PORT } = require("./config");

const app = express();


app.get("/api/library", (req, res) => {
  knex
    .select("*")
    .from("books")
    .then(results => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch(error => {
      res.status(500);
      console.error("Internal sever error", error);
    });
});

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get(/^(?!\/api(\/|$))/, (req, res) => {
  const index = path.resolve(__dirname, "../client/build", "index.html");
  res.sendFile(index);
});

let server;
let knex;

const runServer = (port = 3001, database = DATABASE) => {
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
          return reject(err);
        }
        resolve();
      });
    });
  });
};

if (require.main === module) {
  runServer().catch(err => {
    console.error(`Can't start server: ${err}`);
    throw err;
  });
}
module.exports = { app, runServer, closeServer };
