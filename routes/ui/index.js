const express = require('express');
const router = express.Router();
const auth = require('../auth');

module.exports = function (NimiqHelper) {

    router.get('/', auth.required, function (req, res, next) {
        if (req.cookies && !req.cookies.accessToken) {
            return res.redirect('/login');
        }
        res.render('dashboard', {title: 'Dashboard - Nimiq Wallet Manager', user:  req.payload});
    });

    /* GET example page. */
    router.get('/example', function (req, res, next) {
        res.render('example', {title: 'Nimiq style - Nimiq Wallet Manager'});
    });
    router.use('/login', require('./login')(NimiqHelper));
    router.use('/logout', require('./logout')(NimiqHelper));
    router.use('/register', require('./register')(NimiqHelper));
    return router;
};

