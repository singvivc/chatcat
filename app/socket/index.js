'use strict';
const h = require('../helpers');

module.exports = (io, app) => {
   let allrooms = app.locals.chatrooms;

   io.of('/roomslist').on('connection', socket => {
      socket.on('getChatrooms', () => {
         socket.emit('chatRoomList', JSON.stringify(allrooms));
      });
      socket.on('createNewRoom', (room) => {
         // check to see if a room with the same title exists or not
         // if not, create one and broadcast it to everyone
         if(!h.findRoomByName(allrooms, room)) {
            // Create a new room and broadcast to all
            allrooms.push({
               room: room,
               roomID: h.randomHex(),
               users: []
            });
            // Emit an updated list to the creator
            socket.emit('chatRoomList', JSON.stringify(allrooms));
            // Emit an updated list to everyone connected to the rooms page
            socket.broadcast.emit('chatRoomList', JSON.stringify(allrooms));
         }
      });
   });

   io.of('/chatter').on('connection', socket => {
      // Join a chatroom
      socket.on('join', data => {
         let usersList = h.addUserToRooms(allrooms, data, socket);
         // Update the list of active users as shown on the chatroom page
         if(usersList !== undefined) {
            socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
            socket.emit('updateUsersList', JSON.stringify(usersList.users));   
         }
      });
      // When a socket exits
      socket.on('disconnect', () => {
         // Find the room, to which the socket is connected to and purge the user
         let room = h.removeUserFromRoom(allrooms, socket);
         if(room !== undefined) {
            socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
         }         
      });

      // When a new message arrives
      socket.on('newMessage', data => {
         socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
      });
   });
}