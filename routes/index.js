var express = require('express');
var User = require('../models/User');
var Host = require('../models/Host');
var router = express.Router();
var _ = require('lodash');

var countries = [
  "용인", '서울', '대구', '대전', '인천', '부산', '울산', '원주', '광주', '제주도', '울릉도'
 ];


router.get('/suggest', function(req, res, next) {
  var q = req.query.q;
    var ret = _.filter(countries, function(name) {
    return name.toLowerCase().indexOf(q.toLowerCase()) > -1;
     });
  res.json(ret);
});

router.post('/search', function(req, res, next){
  Host.find({city : req.body.q}, function(err, hosts){//입력한 도시와 Host에 저장된 도시를 찾는다.
      if(err){
        return next(err);
      }
      res.render('host/search', {hosts : hosts});
  });
});

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
