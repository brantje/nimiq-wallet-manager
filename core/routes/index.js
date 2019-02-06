const express = require('express');
const router = express.Router();

module.exports = function (NimiqHelper) {
    router.use('/api/v1', require('./api')(NimiqHelper));
    router.use('/socket', require('./socket/events')(NimiqHelper));
    router.use('/', require('./ui')(NimiqHelper));
    router.use('*', require('./ui')(NimiqHelper));
    return router;
};

