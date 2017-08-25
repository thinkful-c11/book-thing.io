require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL;
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || global.TEST_DATABASE_URL;

exports.TEST_DATABASE = {
  client: "pg",
  connection: TEST_DATABASE_URL,
  pool: { min: 0, max: 3 }
};

exports.DATABASE = {
  client: "pg",
  connection: DATABASE_URL,
  pool: { min: 0, max: 3 }
};

// exports.DATABASE = [
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1}
// ]

exports.PORT = process.env.PORT || 8080;
