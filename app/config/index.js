'use strict';
if(process.env.NODE_ENV === 'production') {
   // offer production stage environment variables
   // process.env.REDIS_URL ::
   let redisUri = require('url').parse(process.env.REDIS_URL);
   let redisPassword = redisUri.auth.split(':')[1];
   module.exports = {
      host: process.env.host || '',
      dbUri: process.env.dbUri,
      sessionSecret: process.env.sessionSecret,
      facebook: {
         clientID: process.env.clientID,
         clientSecret: process.env.clientSecret,
         callbackURL: process.env.host + '/auth/facebook/callback',
         profileFields: ['id', 'displayName', 'photos']
      },
      twitter: {
         consumerKey: process.env.clientID,
         consumerSecret: process.env.clientSecret,
         callbackURL: process.env.host + '/auth/facebook/callback',
         profileFields: ['id', 'displayName', 'photos']
      },
      redis: {
         host: redisUri.hostname,
         port: redisUri.port,
         password: redisPassword
      }
   }
} else {
   // offer development stage settings and data
   module.exports = require('./development.json');
}