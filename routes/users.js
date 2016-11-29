var express = require('express');
var router = express.Router();
var User = require('../models/User');

//로그인이 필요할 시
function needAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else {
    req.flash('danger', '로그인 하시오');
    res.redirect('/signin');
  }
}

//회원가입 시 예외 처리
function validateForm(form, options){
  var name = form.name || '';
  var email = form.email || '';
  name = name.trim();
  email = email.trim();

  if(!name){
    return '이름을 입력하시오';
  }
  if(!email){

  }
   if(!form.password && options.needPassword){
     return '비밀번호를 입력하시오.';
    
  }
   if(form.password.length < 6){
     return '비밀번호는 6자 이상입니다.';
    
  }
   if(form.password !== form.password_confirmation){
     return '비밀번호가 일치하지 않습니다.';
    
  }

  return null;
}

//
router.get('/', needAuth, function(req, res, next){
  if(!req.user.manager){
    req.flash('danger', '관리자가 아닙니다.');
    return res.redirect('back');
  }
  User.find({}, function(err, users){
    if(err){
      return next(err);
    }
    res.render('users/index', {users : users});
  });
});

//회원가입 
router.get('/new', function(req, res, next){
  res.render('users/new', {messages : req.flash()});
});
 
 //회원정보 수정
 router.get('/:id/edit', function(req, res, next){
   User.findById(req.params.id, function(err, user){
     if(err){
       return next(err);
     }
     res.render('users/edet', {user : user});
   });
 });

//회원정보 수정
 router.put('/:id', function(req, res, next){
   var err = validateForm(req.body, {needPassword : false});
   if(err){
     req.flash('danger', err);
     return res.redirect('back');
   }
   User.findById({_id : req.params.id}, function(err, user){
     if(err){
       return next(err);
     }
     if(!user){
       req.flash('danger', '존재하지 않는 사용자입니다.');
       return res.redirect('back');
     }
     if(user.password !== req.body.current_password){
       req.flash('danger', '현재 비밀번호가 일치하지 않습니다.');
       return res.redirect('back');
     }

     user.name = req.body.name;
     user.email = req.body.email;

     if(req.body.password){
       user.password = req.body.password;
     }
     user.save(function(err){
       if(err){
         return next(err);
       }
       req.flash('success', '사용자 정보가 변경되었습니다.');
       res.redirect('/users/' + req.user._id);
     });
   });
 });

//회원정보 삭제
 router.delete('/:id', function(req, res, next){
   User.findOneAndRemove({_id : req.body.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '사용자 계정이 삭제되었습니다.');
     res.redirect('/users');
   });
 });

 //회원정보 보기
 router.get('/:id', function(req, res, next){
   User.findById(req.params.id, function(err, user){
     if(err){
       return next(err);
     }
     res.render('users/show', {user : user});
   });
 });

 //회원가입
 router.post('/', function(req, res, next){
   var err = validateForm(req.body, {needPassword : true});
   if(err){
     req.flash('danger', err);
     return res.redirect('back');
   }
   User.findOne({email : req.body.email}, function(err, user){
     if(err){
       return next(err);
     }
     if(user){
       req.flash('danger', '동일한 이메일 주소가 이미 존재합니다.');
       res.redirect('back');
     }
     var newUser = new User({
       name : req.body.name,
       email : req.body.email
     });
     newUser.password = newUser.generateHash(req.body.password);

     newUser.save(function(err){
       if(err){
         return next(err);
       }else {
         req.flash('success', '가입 성공 로그인 하시오.');
         res.redirect('/');
       }
     });
   });
 });

module.exports = router; 

