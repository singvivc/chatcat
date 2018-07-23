'use strict';
const config = require('../config');
const Mongoose = require('mongoose');
const logger = require('../logger');

// log an error if the connection fails
Mongoose.connect(config.dbUri, {useNewUrlParser: true}).then(() => {
   logger.log('info', 'Successfully connected to the mongo database');
}).catch(error => {
   logger.log('error', 'Mongo Error: Error occurred while connecting to the mongo database ' + error);
});

// Create a Schema that defines the structure for storing user data
const chatUser = new Mongoose.Schema({
   profileId: String,
   fullName: String,
   profilePicture: String
});

// Turn the schema into a usable model to create an instance of the user object
let userModel = Mongoose.model('chatUser', chatUser);

module.exports = { Mongoose, userModel };