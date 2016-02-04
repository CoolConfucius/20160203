var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

// var Person = require('../models/person');
// var Apartment = require('../models/apartment');

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




// People

// router.get('/people', function(req, res, next) {
//   console.log("get all people");
//   Person.find({}, function(err, people){
//     res.status(err ? 400 : 200).send(err || people);
//   });
// });

// router.post('/people', function(req, res, next) {
//   console.log("Post someone: ", req.body);
//   // Person.insert(req.body, function(err, person){
//   //   res.status(err ? 400 : 200).send(err || person);
//   // });
//   var person = new Person(req.body); 
//   person.save(function(err, savedPerson) {
//     res.status(err ? 400 : 200).send(err || savedPerson);
//   });
// });

// router.get('/people/first/:limit', function(req, res, next) {
//   console.log("get first "+req.params.limit+" people");
//   Person.find({}, function(err, people){
//     res.status(err ? 400 : 200).send(err || people);
//   }).limit(req.params.limit);
// });

// router.get('/people/restaurant', function(req, res, next) {
//   console.log("get restaurant");
//   Person.find({occupation: {$in: ['cook', 'dishwasher', 'waiter']}}, function(err, people){
//     res.status(err ? 400 : 200).send(err || people);
//   });
// });

// router.get('/people/chain', function(req, res, next) {
//   console.log("get chain");
//   Person
//   .find({occupation: {$in: ['cook', 'dishwasher', 'waiter']}})
//   .limit(10)
//   .sort({age: -1})
//   .exec(function(err, people){
//     res.status(err ? 400 : 200).send(err || people);
//   });
// });

// router.post('/people', function(req, res, next) {
//   Person.create(req.body, function(err, person) {
//     console.log();
//     res.status(err ? 400 : 200).send(err || person);
//   })
// });


// // router.get('/people', function(req, res, next) {
// //   console.log("query stirng", req.query);
// //   // req.query === {} // no query 
// //   // GET localhost:3000/persons?company=MARVANE&sort=age
// //   // req.query === {company: "MARVANE", sort: "age"}
  
// //   if (req.query.sort) {
// //     //if I do have a sort, 
// //     var sortObj = {};
// //     // sortObj[req.query.sort] = req.query.asc ? 1 : -1;
// //     // ^ don't need this cuz it'll default to descending anyway. 
// //     sortObj[req.query.sort] = req.query.desc ? -1 : 1;
// //   };

// //   if (req.query.limit) {
// //     var limit = parseInt(req.query.limit);
// //     // if I have a limit, I'll have the limit varible
// //   };

// //   // what does delete do in javascript? It removes a key from the object, and the value that goes with it. the reason I'm doing that is, so when things go after these things... so I can pass the remaining of the req.query to my find. 
// //   delete req.query.sort;
// //   delete req.query.desc;
// //   delete req.query.limit;

// //   Person
// //   .find(req.query).limit(limit).sort(sortObj)
// //   .exec(function(err, people){
// //     res.status(err ? 400 : 200).send(err || people);
// //   });

// // // can also do: 
// //   // var query = Person.find(req.query); 
  
// //   // if (req.query.limit) {
// //   //   var limit = parseInt(req.query.limit);
// //   //   query.limit(limit);
// //   // };

// //   // if (req.query.sort) {
// //   //   var sortObj = {};
// //   //   sortObj[req.query.sort] = req.query.desc ? -1 : 1;
// //   //   query.sort(sortObj); 
// //   // };
// // // ^ doesn't have to be chained, can be in parts. But may have problems in this example. 

// // });

// // Clean 
// router.get('/people', function(req, res, next) {

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

//   Person
//   .find(req.query).limit(limit).sort(sortObj)
//   .exec(function(err, people){
//     res.status(err ? 400 : 200).send(err || people);
//   });
// });


// router.put('/', function(req.))



module.exports = router;
