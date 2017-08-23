
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL
  pool: { min: 0, max: 3},
};

// exports.DATABASE = [
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1},
//   {title: 'me', author: 'me', description: 'This is me', 'id': 1}
// ]

exports.PORT = process.env.PORT || 8080;
