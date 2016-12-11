var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    startdate : {type : Date, required : true},
    deaddate : {type : Date, required : true},
    maker_id : {type : String, required : true},
    maker_name : {type : String, required : true}, 
    title : {type : String, required : true},
    content : {type : String, required : true},
    city : {type : String, required : true},
    cost : {type : String, required : true},
    address : {type : String, required : true},
    addressnumber : {type : String, required : true},
    rule : {type : String, required : true},
    market : {type : String, required : true},
    picturePath : {type : String},
    createdAt : {type : Date, default : Date.now},
    count : {type : String, required : true},
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Host = mongoose.model('Host', Schema); 
 
module.exports = Host; 