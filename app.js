require('dotenv').config()
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const securityHeaders = require('./core/routes/middleware/securityHeaders')
var fs = require('fs')
const Nimiq = require('@nimiq/core')
Log = Nimiq.Log
const mongoose = require('mongoose')
const SocketSingleton = require('./lib/SocketSingletion')
const app = express()
const isProduction = process.env.NODE_ENV === 'production'
const isSecure = process.env.USE_SSL === 'true'
let server
if (isSecure) {
    const https = require('https')
    let options
    try {
        let ciphers = [
            //ChaCha is on the wishlist
            'ECDHE-RSA-AES256-SHA384',
            'DHE-RSA-AES256-SHA384',
            'ECDHE-RSA-AES256-SHA256',
            'DHE-RSA-AES256-SHA256',
            'ECDHE-RSA-AES128-SHA256',
            'DHE-RSA-AES128-SHA256',
            'HIGH',
            '!aNULL',
            '!eNULL',
            '!EXPORT',
            '!DES',
            '!RC4',
            '!MD5',
            '!PSK',
            '!SRP',
            '!CAMELLIA'
        ]
        options = {
            cert: fs.readFileSync(process.env.SSL_CERT),
            key: fs.readFileSync(process.env.SSL_KEY),
            ciphers: ciphers.join(':'),
            secureProtocol: 'TLSv1_2_method',
            honorCipherOrder: true
        }


        if (process.env.SSL_CA) {
            options.ca = [fs.readFileSync(process.env.SSL_CA)]
        }
        server = https.createServer(options, app)
    } catch (e) {
        Log.e('Unable to start https server.')
        Log.e('Your ssl configuration is incorrect')
        Log.e('Error:')
        Log.e(e)
        process.exit(1)
    }
} else {
    const http = require('http')
    server = http.createServer(app)
}
const NH = require('./lib/NimiqHelper')

let NimiqHelper = new NH()
SocketSingleton.configure(server)
mongoose.promise = global.Promise

//Configure Mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_URI, {useNewUrlParser: true})
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

    app.use(function (req, res, next) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        if (res.headersSent) {
            Log.d('Express', ip, req.method, req.originalUrl, res.statusCode)
        } else {
            res.on('finish', function () {
                Log.d('Express', ip, req.method, req.originalUrl, res.statusCode)
            })
        }
        next()
    })
}

// view engine setup
app.set('views', path.join(__dirname, 'core/views'))
app.set('view engine', 'twig')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(
    cookieParser(
        process.env.SESSION_KEY ||
        'a1a91792b1b0a8862cdfeb55820d9a577a16a460b10b2e99425f8851fbea2997'
    )
)

//Configure headers
app.use(securityHeaders())

app.use(express.static(path.join(__dirname, 'core/public')))
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
});

(async () => {
    let {APP_PORT = 3000} = process.env
    NimiqHelper = await NimiqHelper.connect();

    (async () => {
        new NimiqService(NimiqHelper)
    })()

    NimiqHelper.$.consensus.on('established', function () {
        app.use(require('./core/routes')(NimiqHelper))
        server.listen(APP_PORT, '0.0.0.0', () => {
            let prot = (isSecure) ? 'https' : 'http'
            Log.i(`Server running on ${prot}://localhost:${APP_PORT}/`)
        })
    })
})()
