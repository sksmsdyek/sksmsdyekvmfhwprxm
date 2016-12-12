var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    name : {type : String, require : true, trim : true},
    first: {type : String, trim : true},
    sex: {type : String, trim : true},
    birth: {type : String, trim : true},
    phonenumber: {type : String, trim : true},
    language: {type : String, trim : true},
    graphic: {type : String, trim : true},
    city: {type : String, trim : true},
    intro: {type : String, trim : true},
    school: {type : String, trim : true},
    job: {type : String, trim : true},
    email : {type : String, require : true, index : true, unique : true, trim : true},
    password : {type : String},
    createdAt : {type : Date, default : Date.now},
    facebook : {id : String, token : String, photo : String},
    root : {type : Boolean, default : false},
    // resetPasswordToken: String,
    // resetPasswordExpires: Date
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

//
Schema.methods.generateHash = function(password) { 
  var salt = bcrypt.genSaltSync(10); 
  return bcrypt.hashSync(password, salt); 
}; 
 
Schema.methods.validatePassword = function(password) { 
  return bcrypt.compareSync(password, this.password); 
}; 

var User = mongoose.model('User', Schema); 
 
module.exports = User; 
