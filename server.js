'use strict';
const express = require('express');
const app = express();
const chatCat = require('./app');
const passport = require('passport');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(chatCat.session);
app.use(passport.initialize());
app.use(passport.session());
app.use(require('morgan')('combined', {
   stream: {
      write: message => {
         // write to log console
         chatCat.logger.log('info', message)
      }
   }
}));

app.use('/', chatCat.router);

chatCat.ioServer(app).listen(3000, () => console.log('ChatCat running on port 3000'));