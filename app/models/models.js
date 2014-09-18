var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.mongo.url, function (err){
	if(err){
		new Error('Fail to connect db ' + err);
	}else{
		console.log('Connected to db');
	}
});
module.exports = mongoose;