const express = require('express');
const router = express.Router();

module.exports = function (NimiqHelper) {
    router.use('/api/v1', require('./api')(NimiqHelper));
    router.use('/socket', require('./socket/events')(NimiqHelper));

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Express' });
    });
    /* GET example page. */
    router.get('/example', function(req, res, next) {
        res.render('example', { title: 'Express' });
    });

    // router.get('/login', (req, res, next) => {
    //     let nonce = req.nonce;
    //     try {
    //         if (req.cookies && req.cookies.accessToken) {
    //             return res.redirect('/');
    //         }
    //     } catch (e){
    //
    //     }
    //     res.sendFile('login.html', { root: './public' });
    // });
    // router.get('/favicon.ico', (req, res, next) => {
    //     res.sendFile('favicon.ico', { root: './public' });
    // });
    // router.get('/manifest.json', (req, res, next) => {
    //     fs.readFile('./public/manifest.json', function (err, data) {
    //         let json = JSON.parse(data);
    //         res.json(json);
    //     });
    // });
    return router;
};

