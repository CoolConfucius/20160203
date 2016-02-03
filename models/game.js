'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');

var Game; 

var gameSchema = new mongoose.Schema({
  title: {type: String },
  publisher: {type: String },
  rating: {type: String },
  imageURL:{type:String },
  canTrade: { type: Boolean, default: true}
})

Game = mongoose.model('Game', gameSchema);

module.exports = Game;
