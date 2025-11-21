const path = require('path');

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret123',
  PORT: process.env.PORT || 4000,
  DB_PATH: path.join(__dirname, '../../db.json')
};
