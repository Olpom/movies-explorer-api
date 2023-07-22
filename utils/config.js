const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET: process.env.JWT_SECRET || '948', // предоставляем безопасное значение по умолчанию
};
