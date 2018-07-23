'use strict';
const session = require('express-session');
const Mongostore = require('connect-mongo')(session);

const config = require('../config');
const database = require('../database');

if(process.env.NODE_ENV === 'production') {
   // initialize session with settings for production
   module.exports = session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new Mongostore({
         mongooseConnection: database.Mongoose.connection
      })
   })
} else {
   // initialize session with settings for development
   module.exports = session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: true
   })
}