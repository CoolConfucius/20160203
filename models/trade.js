'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');
var Game = require('../models/game');

var Trade; 

var tradeSchema = new mongoose.Schema({
  postedAt: {type: Date, default: Date.now() },
  status: {type: String, default: "pending"},
  // user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  // game: { type: mongoose.Schema.Types.ObjectId, ref: "Game" },

  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  game1: { type: mongoose.Schema.Types.ObjectId, ref: "Game" }, 
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  game2: { type: mongoose.Schema.Types.ObjectId, ref: "Game" }
})

Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
