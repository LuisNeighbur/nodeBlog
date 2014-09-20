var express = require('express'),
	swig = require('swig'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	favicon = require('serve-favicon'),
	app = express(),
	port = process.env.PORT || 3000,
	config = require('./app/config'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	crypto = require('crypto'),
	csrf    = require('csurf');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(favicon(__dirname + '/public/favicon.ico'))
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.set('view cache', false);
app.disable('x-powered-by');
swig.setDefaults({ cache: false });
app.use('/static',express.static(__dirname + '/public'));
var Store = new RedisStore({});
app.use(session({
	store: Store,
	secret: config.secret
}));
debugger;
app.use(csrf({}));
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('session has expired or form tampered with')
})
app.listen(port, function (){
	console.log('Server listen in port ' + port);
});

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
		res.render('index', {'posts': posts, '_token': req.csrfToken()});
	})
});
app.post('/sign-up', function (req, res){
	User.findOne({ user: req.body.username }, function (err, User){
		if(err){
			res.send({
				code: 500,
				message:'User exists'
			});
		}
		var user = new User();
		user.name = req.body.username;
		user.pass = crypto.createHmac('sha512', req.body.username).update(req.body.password).digest('hex');
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
app.post('/sign-in', function (req, res){
	var password = crypto.createHmac('sha512', req.body.username).update(req.body.password).digest('hex');
	User.findOne({ name: req.body.username, pass: password }, function (err, user){
		if(err || !user){
			res.send({
				code: 401,
				message: 'Auth incorrect'
			});
		}
		req.session.user = user;
		res.send({
			code: 200,
			message: 'Auth OK',
			data: user
		})
	});
});
app.post('/publish', function (req, res){
	if(req.body.content && req.body.title){
		User.findOne({ name: req.session.user.name }, function (err, user){
			var post = new Post();
			post.title = req.body.title;
			post.content = req.body.content;
			post.user = user;
			post.save(function (err){
				if(err){
					res.send({
						code: 401,
						message: 'Error at publish'
					});
				}
				res.send({
					code: 200,
					message: 'Publish OK'
				});
			});
		});
	}else{
		res.send({
			code: 401,
			message: 'Need al fields'
		});
	}
});