require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};