var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var Game = require('../models/game');
var User = require('../models/user');
var Trade = require('../models/trade');

router.use(authMiddleware);

// get all games, optional query string 
router.get('/', function(req, res, next) {  
  if (req.query.sort) {
    var sortObj = {};
    sortObj[req.query.sort] = req.query.desc ? -1 : 1;
  };

  if (req.query.limit) {
    var limit = parseInt(req.query.limit);
  };

  delete req.query.sort;
  delete req.query.desc;
  delete req.query.limit;

  Game
  .find(req.query).limit(limit).sort(sortObj)
  .exec(function(err, games){
    if(err) return res.status(400).send(err); 
    // res.render('index', {games:games, state:'games'});
    res.send(games);
  });
});


// my games
// find only games that has the user
router.get('/mine', function(req, res, next) {  
  console.log('requser', req.user);
  User
  .findById(req.user._id)
  .populate('games')
  .exec(function(err, savedUser) {
    res.status(err ? 400 : 200).send(err || savedUser); 
  })
});


// router.put('/', function(req, res) {
//   User.findById(req.user._id, function(err, user) {
//     var game = new Game(req.body); 

//     user.games.push(game);
//     user.save(function(err, savedUser) {
//       res.status(err ? 400 : 200).send(err || savedUser); 
//     });
//   });
// });


router.post('/', function(req, res) {
  User.findById(req.user._id, function(err, user) {
    req.body.userId = req.user._id; 
    var game = new Game(req.body); 
    game.save(function(err, savedGame){
      user.games.push(game._id);
      user.save(function(err, savedUser) {
        res.status(err ? 400 : 200).send(err || savedUser); 
      });
    });
  });
});






module.exports = router;
