var mongoose = require('./models');
var Schema       = mongoose.Schema;
var PostSchema   = new Schema({
	content: String,
	title: String,
	user: { type : Schema.ObjectId, ref : 'User' },
	date: { type: Date, default: Date.now },
	date_update: {type: Date, default: null }
});
module.exports = mongoose.model('Post', PostSchema);