var express = require('express'),
	swig = require('swig'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	favicon = require('serve-favicon'),
	app = express(),
	port = process.env.PORT || 3000,
	config = require('./app/config'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port, function (){
	console.log('Server listen in port' + port);
});
app.use(session({
	store: new RedisStore({
		host: config.redis.host,
		port: config.redis.port,
		pass: config.redis.pass
	}),
	secret: config.secret
}));
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.set('view cache', false);
app.disable('x-powered-by');
swig.setDefaults({ cache: false });
app.use('/static',express.static(__dirname + '/public'));
var User = require('./app/models/user'),
	Post = require('./app/models/post');

app.get('/', function (req, res){
	Post.find({})
	.populate('user')
	.exec(function (err, posts){
		if(err){
			res.statusCode = 500;
			res.send({
				message: err.message
			});
		}
		posts.title = 'Blog';
		res.render('index', posts);
	})
});
app.post('/sign-up', function (req, res){
	User.findOne({ user: req.body.username }, function (err){
		if(err){
			res.send({
				code: 500,
				message:'User exists'
			});
		}
		var user = new User();
		user.name = req.body.username;
		user.pass = req.body.password;
		user.nickname = req.body.nickname;
		user.save(function (err){
			if(err){
					res.send({
					code: 500,
					message:'Error creating user'
				});
			}
			res.send({
				code: 200,
				message: 'User Created'
			})
		});
	})
});
app.post('/sign-in', function (req, res){});