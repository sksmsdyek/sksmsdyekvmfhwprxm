var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Host = require('../models/Host');
var Room = require('../models/Room');

function needAuth(req, res, next) { 
  if (req.isAuthenticated()) { 
    return next(); 
  } 
  else { 
    req.flash('danger', '로그인이 필요합니다.'); 
    res.redirect('/signin'); 
  } 
} 

//호스팅작성하는 부분
router.get('/index', needAuth, function(req, res, next){
    Host.find({}, function(err, host){
     if(err){
       return next(err);
     }

  res.render('host/index', {host : host});
  });
});

//호스팅한 결과 상세보기 눌렀을 시
router.get('/:id/detail',needAuth, function(req, res, next){
  Host.findById(req.params.id, function(err, host){
      if(err){
        return next(err);
      }
      res.render('host/detail', {host : host});
   });
});

//호스팅이 완료했다고 표시하는 부분
router.get('/update', needAuth, function(req, res, next){
  res.render('host/update');
});

//호스팅 내용을 데이터베이스에 저장
router.post('/update', needAuth, function(req, res, next){
if(!req.body.title || !req.body.content || !req.body.city || !req.body.rule || !req.body.market || !req.body.address || !req.body.cost){
    req.flash('danger', '모두 입력하시오.');
    return res.redirect('back');
  }
    var host = new Host({
      title : req.body.title,
      content : req.body.content,
      city : req.body.city,
      cost : req.body.cost,
      address : req.body.address,
      rule : req.body.rule,
      market : req.body.market,
      deadline : req.body.deadline
    });
    host.save(function(err){
      if(err){
        return next(err);
      }
      res.redirect('/host/update');
    });
});

//예약 관리
router.get('/management', function(req, res, next){
  Host.find({}, function(err, host){
    res.render('host/management', {host : host});
  });
});


module.exports = router; 