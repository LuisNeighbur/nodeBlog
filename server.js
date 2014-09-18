var express = require('express'),
	swig = require('swig'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	favicon = require('serve-favicon'),
	app = express(),
	port = process.env.PORT || 3030,
	config = require('./app/config');
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
app.use(favicon(__dirname + '/public/favicon.ico'))
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app/views');
app.set('view cache', false);
app.disable('x-powered-by');
swig.setDefaults({ cache: false });
app.use(express.static(__dirname + '/public'));