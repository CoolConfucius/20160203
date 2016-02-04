var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

var Game = require('../models/game');
var User = require('../models/user');
var Trade = require('../models/trade');

router.use(authMiddleware);

// See all trades + optional query string
router.get('/', function(req, res, next) {  
  if (req.query.sort) {
    var sortObj = {};
    sortObj[req.query.sort] = req.query.desc ? -1 : 1;
  };

  if (req.query.limit) {
    var limit = parseInt(req.query.limit);
  };

  delete req.query.sort; delete req.query.desc; delete req.query.limit;

  Trade
  .find(req.query).limit(limit).sort(sortObj)
  .populate('user1')
  .populate('game1')
  .populate('user2')
  .populate('game2')
  .exec(function(err, trades){
    if(err) return res.status(400).send(err); 
    res.render('trades', {trades:trades, state:'trades', user:req.user});
    // res.send(trades)
  });
});

// See my trades
router.get('/mine', function(req, res, next) {  
  Trade
  .find({
    $or: [{user1: req.user._id}, {user2: req.user._id}]
  })
  .populate('user1')
  .populate('game1')
  .populate('user2')
  .populate('game2')
  .exec(function(err, trades){
    console.log("trades:", trades);
    if(err) return res.status(400).send(err); 
    res.render('trades', {trades:trades, state:'myTrades', user:req.user});
    // res.send(trades)
  });
});

// Accept a trade, using four params 
// router.put('/:user1/:game1/:user2/:game2', function(req, res) {
//   User.findById(req.params.user1, function(err, user1) {
//     if(err) res.status(400).send(err);
//     User.findById(req.params.user2, function(err, user2) {
//       if(err) res.status(400).send(err);
//       Game.findById(req.params.game1, function(err, game1) {
//         if(err) res.status(400).send(err);
//         Game.findById(req.params.game2, function(err, game2) {
//           if(err) res.status(400).send(err);
          
//           var index1 = user1.games.indexOf(req.params.game1);
//           user1.games.splice(index1, 1);

//           var index2 = user2.games.indexOf(req.params.game2);
//           user2.games.splice(index2, 1);

//           user1.games.push(req.params.game2);
//           user2.games.push(req.params.game1);

//           user1.save(function(err, savedUser1) {
//             user2.save(function(err, savedUser2) {
//               res.status(err ? 400 : 200).send(err || savedUser1);
//             })
//           })
//         });
//       });   
//     });
//   });
// });


// Post trade: 
router.post('/:user1/:game1/:user2/:game2', function(req, res) {
  
      Game.findById(req.params.game1, function(err, game1) {
        if(err) res.status(400).send(err);
        Game.findById(req.params.game2, function(err, game2) {
          if(err) res.status(400).send(err);
          if (!game1.canTrade || !game2.canTrade) {
            res.send("Not both games are open to trade!"); return; 
          };

          var trade = new Trade({
            user1: req.params.user1,
            game1: req.params.game1,
            user2: req.params.user2,
            game2: req.params.game2
          });
          game1.canTrade = false; 
          game2.canTrade = false; 

          game1.save(function(err, savedGame1) {
            game2.save(function(err, savedGame2) {
              trade.save(function(err, savedTrade) {
                res.status(err ? 400 : 200).send(err || savedTrade); 
              });
            });
          });

        });
      });   
    
});


// Accept a trade using a trade id: 
router.put('/:tradeId', function(req, res) {
  Trade.findById(req.params.tradeId, function(err, trade){
    if(err) res.status(400).send(err);
    if (trade.status!=="pending") { 
      res.send("Not an open trade!"); return; 
    };
    User.findById(trade.user1, function(err, user1) {
      if(err) res.status(400).send(err);
      User.findById(trade.user2, function(err, user2) {
        if(err) res.status(400).send(err);
        Game.findById(trade.game1, function(err, game1) {
          if(err) res.status(400).send(err);
          Game.findById(trade.game2, function(err, game2) {
            if(err) res.status(400).send(err);
            
            var index1 = user1.games.indexOf(trade.game1);
            user1.games.splice(index1, 1);

            var index2 = user2.games.indexOf(trade.game2);
            user2.games.splice(index2, 1);

            user1.games.push(trade.game2);
            user2.games.push(trade.game1);

            trade.status = "complete"; 

            user1.save(function(err, savedUser1) {
              user2.save(function(err, savedUser2) {
                trade.save(function(err, savedTrade) {
                  res.status(err ? 400 : 200).send(err || savedTrade);                  
                })
              });
            });

          });
        });   
      });
    });
  });
});


// Decline a trade using a trade id: 
router.put('/decline/:tradeId', function(req, res) {
  Trade.findById(req.params.tradeId, function(err, trade){
    if(err) res.status(400).send(err);
    if (trade.status!=="pending") { 
      res.send("Not an open trade!"); return; 
    };
    
    Game.findById(trade.game1, function(err, game1) {
      if(err) res.status(400).send(err);
      Game.findById(trade.game2, function(err, game2) {
        if(err) res.status(400).send(err);
        
        game1.canTrade = true; 
        game2.canTrade = true; 

        trade.status = "declined"; 

        game1.save(function(err, savedUser1) {
          game2.save(function(err, savedUser2) {
            trade.save(function(err, savedTrade) {
              res.status(err ? 400 : 200).send(err || savedTrade);                  
            });
          });
        });

      });
    });   
      
  });
});



module.exports = router;
