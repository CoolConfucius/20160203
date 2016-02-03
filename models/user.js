'use strict';

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var JWT_SECRET = process.env.JWT_SECRET;

var User;
var Game = require('../models/game');
var Trade = require('../models/trade');

var userSchema = new mongoose.Schema({
  uid: { type: String },
  email: { type: String }, 
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }]
  // ,
  // trades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trade" }]
});

// instance method
userSchema.methods.generateToken = function() {
  var payload = {
    uid: this.uid,
    _id: this._id
  };
  var token = jwt.encode(payload, JWT_SECRET);

  return token;
};

var User = mongoose.model('User', userSchema);

module.exports = User;
