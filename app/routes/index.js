'use strict';
const router = require('express').Router();
const passport = require('passport');
const h = require('../helpers');
const config = require('../config');

module.exports = () => {
   let routes = {
      'get': {
         '/': (request, response, next) => {
            response.render('login');
         },
         '/rooms': [h.isAuthenticated, (request, response, next) => {
            response.render('rooms', {
               user: request.user,
               host: config.host
            });
         }],
         '/chat/:id': [h.isAuthenticated, (request, response, next) => {
            // Find a chatroom with the given id
            // Render it if the id is found
            let getRoom = h.findRoomById(request.app.locals.chatrooms, request.params.id);
            if(getRoom === undefined) {
               next();
            } else {
               response.render('chatroom', {
                  user: request.user,
                  host: config.host,
                  room: getRoom.room,
                  roomID: getRoom.roomID
               });
            }
         }],
         '/auth/facebook': passport.authenticate('facebook'),
         '/auth/facebook/callback': passport.authenticate('facebook', { successRedirect: '/rooms', failureRedirect: '/' }),
         '/auth/twitter': passport.authenticate('twitter'),
         '/auth/twitter/callback': passport.authenticate('twitter', { successRedirect: '/rooms', failureRedirect: '/' }),
         '/logout': (req, res, next) => {
            req.logout();
            res.redirect('/');
         }
      },
      'post': {

      },
      'NA': (request, response, next) => {
         response.status(404).sendFile(process.cwd() + '/views/404.htm');
      }
   }
   return h.route(routes);
}