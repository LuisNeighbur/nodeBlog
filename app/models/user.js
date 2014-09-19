var mongoose = require('./models');
var Schema       = mongoose.Schema;
var UserSchema   = new Schema({
	name: String,
	pass: String,
	nickname: String
});
module.exports = mongoose.model('User', UserSchema);