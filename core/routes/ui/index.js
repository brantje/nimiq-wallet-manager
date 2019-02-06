const express = require('express');
const router = express.Router();
const auth = require('../auth');

module.exports = function (NimiqHelper) {
    /* GET example page. */
    router.get('/example', function (req, res, next) {
        res.render('example', {title: 'Nimiq style - Nimiq Wallet Manager'});
    });


    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Dashboard - Nimiq Wallet Manager', user:  req.payload});
    });

    router.get('*', function (req, res, next) {
        res.render('index', {title: 'Dashboard - Nimiq Wallet Manager', user:  req.payload});
    });


    // router.use('/login', require('./login')(NimiqHelper));
    // router.use('/logout', require('./logout')(NimiqHelper));
    // router.use('/register', require('./register')(NimiqHelper));
    return router;
};

