var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

var Schema = new Schema({
    deadline : {type :Date, required : true},
    startline : {type : Date, required : true},
    user: {type: Schema.Types.ObjectId, index: true, required: true}
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

var Room = mongoose.model('Room', Schema); 
 
module.exports = Room; 