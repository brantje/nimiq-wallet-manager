const express = require('express')
const router = express.Router()

module.exports = function (NimiqHelper) {
    router.use('/accounts', require('./accounts')(NimiqHelper))
    router.use('/blocks', require('./blocks')(NimiqHelper))
    router.use('/transactions', require('./transactions')(NimiqHelper))
    router.use('/network', require('./network')(NimiqHelper))
    return router
}