'use strict';
const passport = require('passport');
const config = require('../config');
const h      = require('../helpers');
const logger = require('../logger');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

module.exports = () => {
   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      // Find the user using the _id
      h.findById(id).then(user => done(null, user)).catch(error => {
         logger.log('error', 'Error while deserializing the user');
      });
   })
   
   // accessToken = token and refreshToken = tokenSecret in case of Twitter based authentication
   let authProcessor = (accessToken, refreshToken, profile, done) => { 
      // Find a user in the local db using profile.id
      // If the user is found, return the user data using the done() method
      // If the user is not found, create one in the local db and then return the done() method
      h.findOne(profile.id).then(result => {
         if(result) {
            done(null, result);
         } else {
            // create a new user and return
            h.createNewUser(profile).then(newChatUser => done(null, newChatUser)).catch(error => {
               logger.log('info', 'Create new user error ' + error);
            });
         }
      })
   }
   passport.use(new FacebookStrategy(config.facebook, authProcessor));
   passport.use(new TwitterStrategy(config.twitter, authProcessor));
}