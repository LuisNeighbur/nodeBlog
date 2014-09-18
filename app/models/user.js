var mongoose = require('./model');
var Schema       = mongoose.Schema;
var UserSchema   = new Schema({
	name: String,
	pass: String
});
module.exports = mongoose.model('User', UserSchema);