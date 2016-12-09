var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Host = require('../models/Host');
var Room = require('../models/Room');


//로그인이 필요하다고 알려준다.
function needAuth(req, res, next){
  if(req.isAuthenticated()){
    next();
  }else {
    req.flash('danger', '로그인 하시오.');
    res.redirect('/signin');
  }
}

//회원정보 수정 시 예외 처리
function validateForm(form, options){
  var name = form.name || '';
  var email = form.email || '';
  
  name = name.trim();
  email = email.trim();

  if(!name){
    return '이름을 입력하시오';
  }
  if(!email){
    return '이메일을 입력하시오';
  }
  if(!form.password && options.needPassword){
     return '비밀번호를 입력하시오.';
  }
  if(form.newpassword){
    if(form.newpassword !== form.new_password){
      return '변경할 비밀번호가 일치하지 않습니다.';
    }
  }else
  if(options.needPassword){
    if(form.password !== form.new_password){
      return '비밀번호가 일치하지 않습니다.';
    }
  }
  if(form.password.length < 6){
     return '비밀번호는 6자 이상입니다.';
  }
  return null;
}

//관리자가 사용자 목록 관리
router.get('/root', needAuth, function(req, res, next){
  if(!req.user.root){
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
     newUser.password =newUser.generateHash(req.body.password);

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

//회원가입 
router.get('/new', function(req, res, next){
  res.render('users/new', {messages : req.flash()});
});
 
 //회원정보 수정누를시 edit로 넘어간다.
 router.get('/:id/edit', function(req, res, next){
   User.findById(req.params.id, function(err, user){
     if(err){
       return next(err);
     }
     res.render('users/edit', {user : user});
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
     if(!user.validatePassword(req.body.password)){
       req.flash('danger', '현재 비밀번호가 일치하지 않습니다. 옳바른 입력을 하시오.');
       return res.redirect('back');
     }
     user.name = req.body.name;
     user.email = req.body.email;

     if(req.body.newpassword){
       user.password = user.generateHash(req.body.newpassword);
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
   User.findOneAndRemove({_id : req.params.id}, function(err){
     if(err){
       return next(err);
     }
     req.flash('success', '사용자 계정이 삭제되었습니다.');
     res.redirect('back');
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

// //비밀번호 찾기
// router.get('/forgot', function(req, res, next){

//     res.render('users/forgot', {user : req.user});
// });

// //비밀번호 찾기
//  router.post('/forgot', function(req, res, next){
//   async.waterfall([
//     function(done){
//       crypto.randomBytes(20, function(err, buf){
//         var token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     function(token, done) {
//       User.findOne({ email: req.body.email }, function(err, user){
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           return res.redirect('/users/forgot');
//         }

//         user.resetPasswordToken = token;
//         user.restPasswordExpers = Date.now() + 3600000;
//         user.save(function(err){
//           done(err, token, user);
//         });
//       });
//     },
//     function(token, user, done) {
//       var options = {
//         auth: {
//           api_user: process.env.SGLOGIN,
//           api_key: process.env.SGPASS
//         }
//       }

//       var client = nodemailer.createTransport(smtpTransport(options));

//       var mailOptions = {
//         to: user.email,
//         from: 'yhyh0614@gmail.com',
//         subject: 'Authentic8 Password Reset',
//         text: 'You\'re receiving this because you requested a password reset from Authentic8. \n\n' + 'Please click on the following link to complete this process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' + 'If you did not request this password change, please ignore. \n'
//       };
//       client.sendMail(mailOptions, function(err){
//         req.flash('info', 'An e-mail has been sent to ' + user.email + ' with password reset instructions');
//         done(err, 'done');
//       });
//     }
//   ], function(err){
//     if (err) return next(err);
//     res.redirect('/');
//   });
// });




module.exports = router; 

