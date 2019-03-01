require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const csp = require('express-csp-header')
const cors = require('cors')
const http = require('http')
const mongoose = require('mongoose')
const SocketSingleton = require('./lib/SocketSingletion')
const app = express()
const server = http.createServer(app)
const NH = require('./lib/NimiqHelper')
const Nimiq = require('@nimiq/core')
Log = Nimiq.Log
let NimiqHelper = new NH()
SocketSingleton.configure(server)
const isProduction = process.env.NODE_ENV === 'production'
mongoose.promise = global.Promise

//Configure Mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_URI, { useNewUrlParser: true })
if (!isProduction) {
    mongoose.set('debug', true)
}
mongoose.set('useCreateIndex', true)
require('./core/models/Block')
require('./core/models/Transaction')
require('./core/models/User')
require('./core/models/Wallet')
require('./core/models/Session')
require('./core/models/Contact')
require('./core/config/passport')

const NimiqService = require('./services/NimiqService')

if (!isProduction) {
    Log.instance.level = 'debug'
    /*for (const tag in config.log.tags) {
        Nimiq.Log.instance.setLoggable(tag, config.log.tags[tag]);

    }*/
    Log.instance.setLoggable('ConnectionPool', Log.Level.ASSERT)
    Log.instance.setLoggable('Network', Log.Level.ASSERT)

    app.use(function(req, res, next) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (res.headersSent) {
            Log.d('Express', ip, req.method, req.originalUrl, res.statusCode)
        } else {
            res.on('finish', function() {
                Log.d('Express', ip, req.method, req.originalUrl, res.statusCode)
            })
        }
        next()
    })
}

// view engine setup
app.set('views', path.join(__dirname, 'core/views'))
app.set('view engine', 'twig')

//Configure our app
app.use(
    cors({
        origin: process.env.DOMAIN_NAME
    })
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(
    cookieParser(
        process.env.SESSION_KEY ||
      'a1a91792b1b0a8862cdfeb55820d9a577a16a460b10b2e99425f8851fbea2997'
    )
)
app.use(
    session({
        secret:
      process.env.SESSION_KEY ||
      'a1a91792b1b0a8862cdfeb55820d9a577a16a460b10b2e99425f8851fbea2997',
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false
    })
)

let stylePolicy = [csp.SELF, '\'unsafe-inline\'']
//Configure SCP
app.use(
    csp({
        policies: {
            'default-src': [csp.SELF, process.env.DOMAIN_NAME],
            'connect-src': [csp.SELF, 'wss://' + process.env.DOMAIN_NAME, 'https://cdn.nimiq.com'],
            'script-src': [csp.SELF, csp.NONCE, csp.EVAL, 'https://cdn.nimiq.com', 'script src \'nonce-469261a9b2a9dd894a48\''],
            'style-src': stylePolicy,
            'font-src': [csp.SELF],
            'img-src': ['data:', csp.SELF],
            'worker-src': [csp.SELF, 'blob:'],
            'block-all-mixed-content': true
        }
    })
)


app.use(express.static(path.join(__dirname, 'core/public')))
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
});

(async () => {
    let { APP_PORT = 3000 } = process.env
    NimiqHelper = await NimiqHelper.connect();

    (async () => {
        new NimiqService(NimiqHelper)
    })()

    app.use(require('./core/routes')(NimiqHelper))
    server.listen(APP_PORT, '0.0.0.0', () =>
        Log.i(`Server running on http://localhost:${APP_PORT}/`)
    )
})()
