var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();
var expressSession = require('express-session');

var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.render('index', {username: req.session.username,
                           msg:req.session.msg,
                           location:req.session.location});
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/user', function(req, res){
    console.log("/user Route");
    if (req.session.user) {
      res.render('user', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
  
router.get('/getcity', function(req, res, next) {
    console.log("in getcity route");
    fs.readFile(__dirname + '/cities.dat.txt',function(err,data) {
        if (err) throw err;
        var cities = data.toString().split("\n");
        var myRe = new RegExp("^" + req['query']['q']); //maybe move this and next line into for loop
        var jsonresult = [];
        for (var i = 0; i < cities.length; i++) {

            var result = cities[i].search(myRe);
            if (result != -1) {
                jsonresult.push({ city: cities[i] });
            }
        }
        res.status(200).json(jsonresult);
    });
})

router.get('/getweather', function(req, res, next) {
    console.log("in getweather route");
    var url = "https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=0a5b1052ae170535f09856db50fa8d9f&q=" + req.query['q'];
    request(url).pipe(res);
})

router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;