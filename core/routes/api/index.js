const express = require('express');
const router = express.Router();


module.exports = function (NimiqHelper) {
    router.use('/nimiq', require('./nimiq-network')(NimiqHelper));
    return router;
};