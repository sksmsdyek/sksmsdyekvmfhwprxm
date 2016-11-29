var express = require('express');
var User = require('../models/User');
var Host = require('../models/Host');
var Room = require('../models/Room');
var router = express.Router();

function needAuth(req, res, next) { 
  if (req.isAuthenticated()) { 
    return next(); 
  } 
  else { 
    req.flash('danger', '로그인이 필요합니다.'); 
    res.redirect('/signin'); 
  } 
} 

router.get('/update', function(req, res, next){
  res.render('room/update');
});

router.post('/update', function(req, res, next){
    if(req.body.startline > req.body.deadline){
      req.flash('danger', '예약 날짜 범위가 잘못되었습니다.');
      return res.redirect('back');
    }
    var room = new Room({
      deadline : req.body.deadline,
      startline : req.body.startline
    });
    room.save(function(err){
      if(err){
        return next(err);
      }
    });
    res.redirect('/room/update');
 
});

module.exports = router;
