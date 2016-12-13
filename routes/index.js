var express = require('express');
var User = require('../models/User');
var Host = require('../models/Host');
var Room = require('../models/Room');
var Comments = require('../models/Comments');

var _ = require('lodash');
var router = express.Router();


var countries = [
'서울', '부산', '인천', '대구', '대전','광주','수원','울산','창원','고양','용인','성남','부천','청주','아산','전주','울산','원주','천안','남양주','화성','안양','김해','포항','평택','제주','시흥','의정부','구미','파주','김포','진주','광명','원주','아산','광주','익산','양산','군포','춘천','경산','군산','여수','순천','경주','거제','목포','강릉','오산','충주','이천','양주','안성','구리','서산','안동','포천','논산','공주','여주','밀양'
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
router.get('/', function(req, res,next){
    var curPage = 1;
    if(req.param('page')){
        curPage = Number(req.param('page'));//정수로 형변환
    }//몇페이지인지에 대한 파라메터가 있으면 값 받음.
    Host.find({}, function(err, hosts){
        Host.count({}, function(err, count){
            if(err){
                return next(err);
            }
            var totalPageNum = Math.ceil(count/3);
            var prevUrl = '/?page=';
            var nextUrl = '/?page=';
            var pages = new Array();
            for(var i=1 ; i<=totalPageNum ; i++){
                pages.push({
                    cls: '',
                    text: i, 
                    url: '/?page='+i
                });
            }//pages라는 배열에 pagination 갯수와 정보 담음
            if(curPage===1){
                prevUrl = prevUrl + String(curPage);
                nextUrl = nextUrl + String(curPage+1);//다시 문자열로 형변환하여 문자끼리 더해줌
            } else if (curPage===totalPageNum){
                prevUrl= prevUrl + String(curPage-1);
                nextUrl = nextUrl + String(curPage);
            } else {
                prevUrl = prevUrl + String(curPage-1);
                nextUrl = nextUrl + String(curPage+1);
            }
            res.render('index', {
                hosts: hosts,
                pagination: {
                    numPosts: count,
                    firstPage: {
                        cls: '',
                        url: '/?page=1'
                    },
                    prevPage: {
                        cls: '',
                        url: prevUrl
                    },
                    nextPage: {
                        cls: '',
                        url: nextUrl
                    },
                    lastPage: {
                        cls: '',
                        url: '/?page='+totalPageNum
                    },
                    pages: pages
                }
            });
        });
    }).limit(6).skip((curPage-1)*6).sort({reservation_count:-1});//3개씩 디비에서 꺼내고 skip을 통해 끌어올 document 구분지음
});



//로그인 누를 시
router.get('/signin', function(req, res, next){
  res.render('signin');
});






module.exports = router;
