require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const csp = require('express-csp-header');
const cors = require('cors');
const http = require('http');
const SocketSingleton = require('./lib/SocketSingletion');
const app = express();
const server = http.createServer(app);
const NH = require('./lib/NimiqHelper');
const Nimiq = require('@nimiq/core');
Log = Nimiq.Log;
let NimiqHelper = new NH();
SocketSingleton.configure(server);
const isProduction = process.env.NODE_ENV === 'production';

if(!isProduction){
    Log.instance.level = 'debug';
    /*for (const tag in config.log.tags) {
        Nimiq.Log.instance.setLoggable(tag, config.log.tags[tag]);

    }*/
    Log.instance.setLoggable('ConnectionPool', Log.Level.ASSERT);
    Log.instance.setLoggable('Network', Log.Level.ASSERT);

    app.use(function(req, res, next) {
        if (res.headersSent) {
                Log.d('Express', req.method, req.url, res.statusCode);
        } else {
            res.on('finish', function() {
                Log.d('Express', req.method, req.url, res.statusCode);
            })
        }
        next();
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


//Configure our app
app.use(cors({
    origin: process.env.DOMAIN_NAME
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY || 'passport-tutorial',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));


let stylePolicy = [
    csp.SELF,
    "'unsafe-inline'"

];
//Configure SCP
app.use(csp({
    policies: {
        'default-src': [csp.SELF, process.env.DOMAIN_NAME],
        'connect-src': [csp.SELF, 'wss://' + process.env.DOMAIN_NAME],
        'script-src': [csp.SELF, csp.NONCE, csp.EVAL],
        'style-src': stylePolicy,
        'font-src': [csp.SELF],
        'img-src': ['data:', csp.SELF],
        'worker-src': [csp.SELF, 'blob:'],
        'block-all-mixed-content': true
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

 (async () => {
    let {PORT = 3000} = process.env;
    NimiqHelper = await NimiqHelper.connect();

    app.use(require('./routes')(NimiqHelper));
    server.listen(PORT, '0.0.0.0', () => Log.i(`Server running on http://localhost:${PORT}/`));
})();
