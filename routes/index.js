var express = require('express');
var User = require('../models/User');
var Host = require('../models/Host');
var router = express.Router();

//첫 화면
router.get('/', function(req, res, next) {
  Host.find({}, function(err, hosts){
    if(err){
      return next(err);
    }
      res.render('index', {hosts : hosts});
  });
});



//로그인 누를 시
router.get('/signin', function(req, res, next){
  res.render('signin');
});





module.exports = router;
