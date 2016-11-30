var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    title : {type : String, required : true},
    content : {type : String, required : true},
    city : {type : String, required : true},
    cost : {type : String, required : true},
    address : {type : String, required : true},
    rule : {type : String, required : true},
    market : {type : String, required : true},
    // user: {type: Schema.Types.ObjectId, index: true, required: true},
    createdAt : {type : Date, default : Date.now},
    picturePath : {type : String}

}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Host = mongoose.model('Host', Schema); 
 
module.exports = Host; 