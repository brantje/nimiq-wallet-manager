const express = require('express')
const router = express.Router()


module.exports = function (NimiqHelper) {
    router.use('/user', require('./user')(NimiqHelper))
    router.use('/wallets', require('./wallet')(NimiqHelper))
    router.use('/contacts', require('./contacts')(NimiqHelper))
    router.use('/transactions', require('./transactions')(NimiqHelper))
    return router
}