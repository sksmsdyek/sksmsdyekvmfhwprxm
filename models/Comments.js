var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    comment : {type : String, required : true},
    guest_id : {type : String, required : true},
    guest_name : {type : String, required : true},
    host_id : {type : String, required : true},
    createdAt : {type : Date, default : Date.now}
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Comments = mongoose.model('Comments', Schema); 
 
module.exports = Comments; 