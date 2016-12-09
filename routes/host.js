var express = require('express');
var multer = require('multer');
var upload = multer({ dest: '/tmp' });
var fs = require("fs");
var router = express.Router();
var User = require('../models/User');
var Host = require('../models/Host');
var Room = require('../models/Room');
var Comments = require('../models/Comments');


function needAuth(req, res, next) { 
  if (req.isAuthenticated()) { 
    return next(); 
  } 
  else { 
    req.flash('danger', '로그인이 필요합니다.'); 
    res.redirect('/signin'); 
  } 
} 

//호스팅한 결과 상세보기 눌렀을 시
router.get('/:id/detail', function(req, res, next){
  Host.findById(req.params.id, function(err, host){
     Comments.find({host_id : req.params.id}, function(err, comments){
      if(err){
        return next(err);
      }
      res.render('host/detail', {host : host, comments : comments});
     });
   });
});

//예약관리 쪽에서 상세보기 눌렀을 시
router.get('/:id/simple_detail', function(req, res, next){
  Host.findById(req.params.id, function(err, host){
      if(err){
        return next(err);
      }
      res.render('host/simple_detail', {host : host});
   });
});

//호스팅하기 눌렀을시 숙소 등록 페이지 불러오기
//User아이디를 이용한다.
router.get('/:id/index', needAuth, function(req, res, next){
    User.findById(req.params.id, function(err, user){
     if(err){
       return next(err);
     }
  res.render('host/index', {user : user});
  });
});

//숙소등록 완료 누를 시 넘어가는 페이지 불러오기
//User아이디를 넘겨준다.
router.get('/:id/update', needAuth,  function(req, res, next){
  User.findById(req.params.id, function(err, user){
    if(err){
      return next(err);
    }
    res.render('index', {user : user});
  });
});

//숙소등록 완료 누를 시 내용을 데이터베이스에 저장
//User아이디를 Host 스키마의 userId에 넣어준다.
router.post('/:id/update', upload.single('file'), function(req, res, next){
    if(!req.body.title || !req.body.content || !req.body.city || !req.body.rule || !req.body.market || !req.body.address || !req.body.cost || !req.body.addressnumber|| !req.body.count || !req.body.startdate || !req.body.deaddate){
    req.flash('danger', '모두 입력하시오.');
    return res.redirect('back');
  }else if(req.body.startdate > req.body.deaddate){
    req.flash('danger', '예약 날짜를 올바르게 설정하시오.');
    return res.redirect('back');
  }
  User.findById(req.params.id, function(err, user){
    if(err){
      return next(err);
    }
  //사진 업로드
    var file = './public/images/' + req.file.originalname;
    var dbPath = 'images/' + req.file.originalname;
    fs.readFile(req.file.path, function(err, data){
    fs.writeFile(file, data, function(err){
    var host = new Host({
      title : req.body.title,
      content : req.body.content,
      city : req.body.city,
      cost : req.body.cost,
      address : req.body.address,
      addressnumber : req.body.addressnumber,
      rule : req.body.rule,
      market : req.body.market,
      picturePath : dbPath,

      maker_id : req.params.id,//숙소 등록시 사용한 이용자 아이디를 Host 스키마의 maker_id로저장
      maker_name : user.name,//숙소 등록시 사용한 이용자의 이름을 Host 스키마의 maker_name로저장

      count : req.body.count,
      startdate : req.body.startdate,
      deaddate : req.body.deaddate
    });
    host.save(function(err){
      if(err){
        return next(err);
      }else {
      req.flash('success', '숙소등록 완료.');
      res.redirect('/');
          }
        });
      });
    });
  });
});



//숙소 예약 페이지를 불러온다.
router.get('/:id/check', needAuth, function(req, res, next){
  Host.findById(req.params.id, function(err, host){
      User.findById(req.user.id, function(err, user){
        res.render('host/check', {host : host, user : user});
    });
  });
});

router.post('/:id/check', needAuth, function(req, res, next){
  User.findById(req.user.id, function(err, user){
    Host.findById(req.params.id, function(err, host){
        if(req.body.count > host.count ){
          req.flash('err', '숙박 인원이 초과하였습니다.');
          return res.redirect('back');
        }else if(req.body.startdate < host.startdate || req.body.deaddate > host.deaddate){
          req.flash('err', '올바른 예약 날짜를 정하시오.');
          return res.redirect('back');
        }
      var newRoom = new Room({
        maker_id : host.maker_id,//숙소를 등록한 사람의 아이디를 ROOM스키마의 mkaer_id로 넘겨준다.
        maker_name : host.maker_name,//숙소를 등록한 사람의 이름을 ROOM스키마의 mkaer_id로 넘겨준다.
        
        host_id : req.params.id,//등록된 숙소의 아이디를 ROOM스키마의 host_id로 넘겨준다.
     
        room_title : host.title,
        room_content : host.content,
        room_cost : host.cost,
        room_count : host.count,
        room_city : host.city,
        room_startdate : req.body.startdate,
        room_deaddate : req.body.deaddate,
        
        guest_id : user.id,//예약한 사람의 아이디를 넘겨준다.
        guest_name : user.name//예약한 사람의 이름을 넘겨준다.
      });
      newRoom.save(function(err){
        if(err){
          return next(err);
        }else{
          req.flash('success', '예약 완료');
          res.redirect('/');
        }
      });
    });
  });
});

//댓글달기
router.post('/:id/detail', function(req, res, next){
  Host.findById(req.params.id, function(err, room){
    User.findById(req.user.id, function(err, user){
      var comments = new Comments({
        host_id : req.params.id,
        comment : req.body.comment,
        root_comment : req.body.root_comment,
        guest_name : user.name,
        guest_id : user.id
      });
      comments.save(function(err){
        if(err){
          return next(err);
        }else{
          req.flash('success', '댓글작성완료');
          res.redirect('back');
        }
      });
    });
  });
});

router.post('/:id/detail', function(req, res, next){
  Comments.findById(req.params.id, function(err, room){
    User.findById(req.user.id, function(err, user){
      var comments = new Comments({
        host_id : req.params.id,
        comment : req.body.comment,
        root_comment : req.body.root_comment,
        guest_name : user.name,
        guest_id : user.id
      });
      comments.save(function(err){
        if(err){
          return next(err);
        }else{
          req.flash('success', '댓글작성완료');
          res.redirect('back');
        }
      });
    });
  });
});




//댓글 삭제
 router.delete('/:id/commentdelete', function(req, res, next){
   Comments.findOneAndRemove({_id : req.params.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '삭제 완료');
     res.redirect('back');
   });
});

// 예약 관리
router.get('/:id/management', needAuth, function(req, res, next){
  User.findById(req.params.id, function(err, user){
    if(err){
      return next(err);
    }
  Room.find({maker_id : req.params.id}, function(err, roomlists){//자신의 방에 누가 예약했는지 알 수 있다.
    Room.find({guest_id : req.params.id}, function(err, rooms){//자신이 예약한 방 목록을 보여준다.
      Host.find({maker_id : req.params.id}, function(err, hosts){//방을 등록한 사람에게 자신이 등록한 방을 보여준다.
        res.render('host/management', {user : user, rooms : rooms, hosts : hosts, roomlists : roomlists});
          });
      });
    });
  });
});

//예약 취소
 router.delete('/:id/delete', function(req, res, next){
  Room.findById(req.params.id, function(err, host){
   Room.findOneAndRemove({_id : req.params.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '예약 취소');
     res.redirect('back');
   });
 });
});

//승인
 router.post('/:id/accept', function(req, res, next){
  Room.findOneAndRemove({_id : req.params.id}, function(err, room){
     req.flash('success', '승인 완료');
     res.redirect('back');
 });
});

//거절
 router.delete('/:id/reject', function(req, res, next){
  Room.findById(req.params.id, function(err, host){
   Room.findOneAndRemove({_id : req.params.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '거절 완료');
     res.redirect('back');
   });
 });
});

//등록한 방 삭제
 router.delete('/:id/room_delete' , function(req, res, next){
  Host.findById(req.params.id, function(err, host){
   Host.findOneAndRemove({_id : req.params.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '삭제 완료');
     res.redirect('back');
   });
 });
});




module.exports = router; 