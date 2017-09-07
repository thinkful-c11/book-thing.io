'use strict';
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL;
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || global.TEST_DATABASE_URL;

exports.CLIENT_ID = process.env.CLIENT_ID || global.CLIENT_ID;
exports.CLIENT_SECRET = process.env.CLIENT_SECRET || global.CLIENT_SECRET;

exports.TEST_DATABASE = {
  client: 'pg',
  connection: TEST_DATABASE_URL,
  pool: { min: 0, max: 3 }
};

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: { min: 0, max: 3 }
};

exports.PORT = process.env.PORT || 3001;
