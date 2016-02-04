var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');


/* GET home page. */
router.get('/', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  var games = [];
  if (req.user && req.user.games) {
    var games = req.user.games; 
  };
  res.render('index', { 
    title: "Game Trade", 
    user: req.user, 
    games: games, 
    state: "home"});
});

router.get('/login', function(req, res, next) {
  res.render('form', {state: 'login', title: "Login"});
});

router.get('/register', function(req, res, next) {
  res.render('form', {state: 'register', title: "Register"});
});


// go to add game form 
router.get('/addGame', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  res.render('addGame', { user: req.user});
});


module.exports = router;
