var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    guest_id : {type : String, required : true},
    host_id : {type : String, required : true}, 
    room_title : {type : String, required : true},
    room_city : {type : String, required : true},
    room_cost : {type : String, required : true} 

}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Favorite = mongoose.model('Favorite', Schema); 
 
module.exports = Favorite; 