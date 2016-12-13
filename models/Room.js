var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    //
    guest_id : {type : String, required : true},
    guest_name : {type : String, required : true},
    //
    maker_id : {type : String, required : true},
    maker_name : {type : String, required : true},
    //
    host_id : {type : String, required : true},
    //
    reservationState : {type : Boolean, default : false},
    //
    room_startdate : {type : String, required : true},
    room_deaddate : {type : String, required : true},
    room_title : {type : String, required : true},
    room_content : {type : String, required : true},
    room_cost : {type : String, required : true},
    room_count : {type : String, required : true},
    room_city : {type : String, required : true},
    
    createdAt : {type : Date, default : Date.now}
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Room = mongoose.model('Room', Schema); 
 
module.exports = Room; 