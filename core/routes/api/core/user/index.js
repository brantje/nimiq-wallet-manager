const express = require('express');
const router = express.Router();


module.exports = function (NimiqHelper) {
    router.use('/login', require('./login')(NimiqHelper));
    router.use('/register', require('./register')(NimiqHelper));
    return router;
};