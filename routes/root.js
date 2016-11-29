var express = require('express'), 
    User = require('../models/User'); 
var router = express.Router(); 

router.get('/', function(req, res, next){
    if(err){
        return next(err);
    }
    res.render('root/new');
});

router.post('/', function(req, res, next){
    User.findOne({email : req.body.email}, function(err, user){
        if(err){
            req.flash('danger', err);
            return res.redirect('back');
        }
        if(user.length !== 0){
            user.manager = true;
            user.save(function(err){
                if(err){
                    next(err);
                }else {
                    req.flash('success', '관리자부여 완료');
                    res.redirect('/');
                }
            });
        }else {
            req.flash('danger', '이메일이 없습니다.');
            res.redirect('back');
        }
    });
});

module.exports = router;