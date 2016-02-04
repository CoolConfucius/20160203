var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var Game = require('../models/game');
var User = require('../models/user');
var Trade = require('../models/trade');

router.use(authMiddleware);

// get all games, optional query string 
// router.get('/', function(req, res, next) {  
//   if (req.query.sort) {
//     var sortObj = {};
//     sortObj[req.query.sort] = req.query.desc ? -1 : 1;
//   };

//   if (req.query.limit) {
//     var limit = parseInt(req.query.limit);
//   };

//   delete req.query.sort;
//   delete req.query.desc;
//   delete req.query.limit;

//   Game
//   .find(req.query).limit(limit).sort(sortObj)
//   .exec(function(err, games){
//     if(err) return res.status(400).send(err); 
//     // res.render('index', {games:games, state:'games'});
//     // res.send(games);
//     res.render('index', { title: "Game Trade", user: req.user, games: games , state: "games"});
//   });
// });

// get games that aren't yours that are available for trade: 
router.get('/', function(req, res, next) {  
  User
  .find({
    '_id': { $ne: req.user._id}
  })
  .populate('games')
  .exec(function(err, users){
    console.log(users, "USERS");
    if(err) return res.status(400).send(err); 
    // res.render('index', {games:games, state:'games'});
    // res.send(games);
    var games = []; 
    users.forEach(function(entry){
      entry.games.forEach(function(game){
        if (game.canTrade) {
          game.userId = entry._id; 
          games.push(game);
        };
      });
    });
    res.render('index', { title: "Game Trade", user: req.user, games: games , state: "games"});
  });
});


// my games
// find only games that has the user
router.get('/mine', function(req, res, next) {  
  console.log('requser', req.user);
  User
  .findById(req.user._id)
  .populate('games')
  .exec(function(err, user) {
    // res.status(err ? 400 : 200).send(err || savedUser); 
    if (err) { res.status(400).send(err); return; };
    res.render('inventory', {games: user.games, user: req.user});
  });
});


router.get('/offerTrade/:desiredGame/:owner', function(req, res, next) {  
  console.log('requser', req.user);
  User
  .findById(req.user._id)
  .populate('games')
  .exec(function(err, user) {
    // res.status(err ? 400 : 200).send(err || savedUser); 
    if (err) { res.status(400).send(err); return; };
    res.render('inventory', {
      state: "offerTrade",
      games: user.games, 
      user: req.user,
      desiredgame: req.params.desiredGame, 
      ownerid: req.params.owner
    });
  });
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
      // console.log("saved Game err",err);
      if (err) {res.status(400).send(err)};
      user.games.push(game._id);
      user.save(function(err, savedUser) {
        // console.log("err",err);
        res.status(err ? 400 : 200).send(err || savedUser); 
      });
    });
  });
});


// Game detail show page: 
router.get('/showpage/:gameId/:ownerId', function(req, res, next){
  Game.findById(req.params.gameId, function(err, game){
    if(err) res.status(400).send(err); 
    User.findById(req.params.ownerId, function(err, owner){
      res.render('showPage', {
        user: req.user,
        game:game, owner:owner,
        gameid: req.params.gameId,
        ownerid: req.params.ownerId
      });
    });
  }); 
});



module.exports = router;
